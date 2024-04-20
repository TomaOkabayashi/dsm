const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const port = 4000;
const { exec } = require("child_process");

// Initialize express application.
const app = express();

// Enable CORS with specific options for allowed origins and a success status.
app.use(
  cors({
    origin: ["http://localhost:9000", "http://localhost:44463"], // Allowed domains for cross-origin requests
    optionsSuccessStatus: 200 // Status to send on successful OPTIONS request
  })
);

// Configuration for multer storage: how files are named and where they are stored.
const storage = multer.diskStorage({
  destination: "./uploads/", // Directory where files will be uploaded
  filename: function (req, file, cb) {
    const newFilename = "floor_plan.png"; // New static name for all uploaded files
    cb(null, newFilename);
  },
});

// Initialize multer with storage configuration and file filter for PNG files only.
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).single("file"); // Accepts only one file, with the form field named 'file'.

// Helper function to check if the uploaded file is a PNG.
function checkFileType(file, cb) {
  if (file.mimetype === "image/png") {
    cb(null, true); // Accept file if it is PNG
  } else {
    cb("Error: Only PNG files are allowed!"); // Reject file if not PNG
  }
}

// Serve static files from the 'uploads' directory.
app.use("/uploads", express.static("uploads"));

// Route to handle POST requests to upload PNG files.
app.post("/upload-png", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.send({
        message: err, // Send error message if there's an error during upload
      });
    } else {
      if (req.file == undefined) {
        res.send({
          message: "Error: No File Selected!", // Send error if no file is selected
        });
      } else {
        res.send({
          message: "File Uploaded!", // Confirm file upload success
          fileInfo: {
            filename: req.file.filename, // Return filename
            path: req.file.path, // Return file path
          },
        });
      }
    }
  });
});

// Route to execute a Python script and return its output.
app.get("/process-projects", (req, res) => {
  exec("python floor_plan.py", (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).send("Failed to execute Python script."); // Send error response if script fails
    }
    res.send(stdout); // Send script output if successful
  });
});

// Start the server on the specified port, confirming with a console message.
app.listen(port, () => console.log(`Server started on port ${port}`));
