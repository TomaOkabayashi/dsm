import cv2
import os
import numpy as np
import pyautogui
import time 
from selenium import webdriver
from selenium.webdriver import Firefox, FirefoxOptions
from selenium.webdriver.common.keys import Keys
from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By

# Get the current directory
current_dir = os.path.dirname(os.path.abspath(__file__))

# Image file name
image_file = "uploads/floor_plan.png"  # Include the 'uploads' directory in the path
output_file = "uploads/output.png" # Include the 'uploads' directory in the path

# Image file path
image_path = os.path.join(current_dir, image_file)
output_path = os.path.join(current_dir, output_file)

# Check if the image file exists
if not os.path.isfile(image_path):
    raise FileNotFoundError(f"Image file '{image_file}' not found.")

def getWalls(image_path, threshold_area, canny_threshold1, canny_threshold2):
    # Load the image
    image = cv2.imread(image_path)
    
    # Convert the image to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    
    # Apply thresholding to segment the walls
    _, thresholded = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)
    
    # Apply Canny edge detection to detect lines
    edges = cv2.Canny(thresholded, canny_threshold1, canny_threshold2)
    
    # Remove small components or noise from the detected lines
    num_labels, labels, stats, _ = cv2.connectedComponentsWithStats(edges, connectivity=8)
    
    # Create a mask to filter out small components
    mask = np.zeros_like(labels, dtype=np.uint8)
    for label in range(1, num_labels):
        area = stats[label, cv2.CC_STAT_AREA]
        if area > threshold_area:
            mask[labels == label] = 255
    
    # Apply the mask to retain only the lines along the walls
    result = cv2.bitwise_and(edges, edges, mask=mask)
    
    # Perform morphological dilation to connect adjacent line segments
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (15, 15))
    dilated = cv2.dilate(result, kernel, iterations=1)

    # Display the resulting image [UNDO TO SEE MID RESULT]
##    cv2.imshow('Original Image', image)
##    cv2.imshow('Lines along Walls', dilated)
    cv2.imwrite(output_path, dilated)

    cv2.waitKey(0)
    cv2.destroyAllWindows()

def reduction(pathToOutput):
    img = cv2.imread(pathToOutput, cv2.IMREAD_GRAYSCALE)

    # Set the desired thickness reduction factor
    thickness_reduction_factor = 9

    # Define the structuring element for erosion
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))

    # Perform erosion
    eroded_image = cv2.erode(img, kernel, iterations=thickness_reduction_factor)

    # Display the eroded image [UNDO TO SEE MID RESULT]
##    cv2.imshow("Eroded Image", eroded_image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
    cv2.imwrite(output_path, eroded_image)

def detect_line_segments(image_path):
    # Load the image in grayscale
    image = cv2.imread(image_path, 0)

    # Apply Canny edge detection
    edges = cv2.Canny(image, 50, 150, apertureSize=3)

    # Perform Hough Line Transform
    lines = cv2.HoughLinesP(edges, rho=1, theta=np.pi / 180, threshold=100, minLineLength=20, maxLineGap=10)

    # Process the detected lines
    dimensions = []
    if lines is not None:
        for line in lines:
            x1, y1, x2, y2 = line[0]
            length = np.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
            angle = np.arctan2(y2 - y1, x2 - x1) * 180 / np.pi
            dimensions.append((x1, y1, x2, y2, length, angle))

    return dimensions

# Call the function to reduce the image to lines and label them
threshold_area = 90
canny_threshold1 = 10
canny_threshold2 = 10
thickness_reduction_factor = 1

# Call the function to remove background elements and retain lines along walls
getWalls(image_path, threshold_area, canny_threshold1, canny_threshold2)

reduction(output_path)

line_segments = detect_line_segments(output_path)

list_of_xcor = []
list_of_ycor = []

for segment in line_segments:
    x1, y1, x2, y2, length, angle = segment
    print(f"Start Point: ({x1}, {y1}), End Point: ({x2}, {y2}), Length: {length}, Angle: {angle}")
    list_of_xcor.append(x1)
    list_of_ycor.append(y1)
    list_of_xcor.append(x2)
    list_of_ycor.append(y2)

list_of_xcor = [int(x) for x in list_of_xcor]
list_of_ycor = [int(y) for y in list_of_ycor]

# Set the downloads directory path
downloads_dir = os.path.join(current_dir, "jsons")
if not os.path.exists(downloads_dir):
    os.makedirs(downloads_dir)

# Set up Firefox options
opts = FirefoxOptions()
opts.add_argument("--width=4000")
opts.add_argument("--height=4000")
opts.add_argument('--headless')

# Set Firefox Preferences to specify the custom download directory
opts.set_preference("browser.download.folderList", 2)  # Use custom download path
opts.set_preference("browser.download.manager.showWhenStarting", False)
opts.set_preference("browser.download.dir", downloads_dir)
opts.set_preference("browser.helperApps.neverAsk.saveToDisk", "application/octet-stream")  # MIME type

# Create the driver with the custom options
driver = Firefox(options=opts)
driver.get('https://cvdlab.github.io/react-planner/')
actionChains = ActionChains(driver)

def selectWall(i):
    cssSelector_OpenMenu = ".toolbar > div:nth-child(4) > div:nth-child(1) > svg:nth-child(1)"
    ## cssSelector = "#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > svg:nth-child(1) > g:nth-child(2) > g:nth-child(2) > g:nth-child(2) > g:nth-child(1) > rect:nth-child(1)"

    button = driver.find_element(By.CSS_SELECTOR, cssSelector_OpenMenu)
    actionChains.move_to_element(button).click().perform()
    time.sleep(0.20)
    if i != 0:
        cssSelector_Wall = "#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > div:nth-child(3)"
    else:
        cssSelector_Wall = "#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(3) > div:nth-child(3)"
    button = driver.find_element(By.CSS_SELECTOR, cssSelector_Wall)
    actionChains.move_to_element(button).click().perform()


def drawWall(x1, y1, x2, y2):
    ## CSS Properties of the Grid
    cssSelector_Grid = "#app > div:nth-child(1) > div:nth-child(2) > div:nth-child(4) > svg:nth-child(1) > g:nth-child(2) > g:nth-child(2) > g:nth-child(2) > g:nth-child(1) > rect:nth-child(1)"
    
    ## Grid Size = (3000, 2000)
    ## Center = (1500,1000)
    Offset_X1 = x1 - 1500
    Offset_Y1 = y1 - 1000

    Offset_X2 = x2 - 1500
    Offset_Y2 = y2 - 1000

    button = driver.find_element(By.CSS_SELECTOR, cssSelector_Grid)
    actionChains.move_to_element_with_offset(button, Offset_X1, Offset_Y1)
    actionChains.click()
    actionChains.move_to_element_with_offset(button, Offset_X2, Offset_Y2)
    actionChains.click()
    actionChains.send_keys(Keys.ESCAPE).perform()

coords = list(map(list, zip(list_of_xcor, list_of_ycor)))

for i in range(0,len(coords),2):
    selectWall(i)
    time.sleep(0.20)
    drawWall(coords[i][0], coords[i][1], coords[i+1][0], coords[i+1][1])

def saveProject():
    time.sleep(0.20)
    ## Properties of the Save Button
    cssSelector_Save = ".toolbar > div:nth-child(2) > div:nth-child(1) > svg:nth-child(1) > path:nth-child(1)"
    ## Find the Save Button
    button = driver.find_element(By.CSS_SELECTOR, cssSelector_Save)
    ## Move to and click the save Button
    actionChains.move_to_element(button).click().perform()

    ## Wait for it to load properly in case
    time.sleep(0.20)
    ## Accept the alert pop-up
    driver.switch_to.alert.accept()

saveProject()
time.sleep(1)
print("clicked")
driver.quit()