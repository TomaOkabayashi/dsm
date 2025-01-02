import { Map, List } from 'immutable';
import diff from 'immutablediff';
import patch from 'immutablepatch';

/**
* Maintains two separate push functions to handle different state management needs:
 1. historyPush - Used for new changes, clears redoList since new changes create a new timeline
    branch, making previous redoable states invalid
 2. historyPushFromRedo - Used when redoing previous changes, preserves redoList since we're
    reconstructing an existing timeline branch rather than creating a new one. This allows 
    continuous undo/redo operations within the same timeline branch.
*/

export const historyPush = (historyStructure, item) => {
  if (historyStructure.last) {
    if (historyStructure.last.hashCode() !== item.hashCode()) {
      let toPush = new Map({
        time: Date.now(),
        diff: diff(historyStructure.last, item)
      });

      historyStructure = historyStructure
        .set('last', item)
        .set('list', historyStructure.list.push(toPush))
        .set('redoList', new List());
    }
  }
  else {
    historyStructure = historyStructure.set('last', item);
  }
  return historyStructure;
};

export const historyPop = (historyStructure) => {
  if (historyStructure.last) {
    if (historyStructure.list.size) {
      let last = historyStructure.first;
      for (let x = 0; x < historyStructure.list.size - 1; x++) {
        last = patch(last, historyStructure.list.get(x).get('diff'));
      }

      historyStructure = historyStructure
        // store the current state in the redoList stack for possible redo
        .set('redoList', historyStructure.redoList.unshift(historyStructure.last))
        .set('last', last)
        .set('list', historyStructure.list.pop());
    }
  }
  return historyStructure;
};

export const historyPushFromRedo = (historyStructure, item) => {
  if (historyStructure.last) {
    if (historyStructure.last.hashCode() !== item.hashCode()) {
      let toPush = new Map({
        time: Date.now(),
        diff: diff(historyStructure.last, item)
      });

      historyStructure = historyStructure
        .set('last', item)
        .set('list', historyStructure.list.push(toPush));
    }
  }
  else {
    historyStructure = historyStructure.set('last', item);
  }
  return historyStructure;
};