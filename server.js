require("dotenv").config();
const express = require("express");
const app = express();
const { google } = require("googleapis");
const bodyParser = require("body-parser");
const fs = require("fs");
const { client_id, client_secret, redirect_uris } = process.env;
const multer = require("multer");
const cors = require("cors");
const PORT = 5000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./assets/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage, limits: { fileSize: 200 * 1024 * 1024 } });
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Load credentials from a JSON file
const credentials = {
  client_id,
  client_secret,
  redirect_uris,
};

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  credentials.client_id,
  credentials.client_secret,
  credentials.redirect_uris[0]
);

const uploadVideoToYoutube = async (
  accessToken,
  { title, description, privacyStatus, videoPath }
) => {
  // Define video metadata
  const videoMetadata = {
    snippet: {
      title,
      description,
    },
    status: {
      privacyStatus, // 'public', 'private', or 'unlisted'
    },
  };

  // Set access token (You need to obtain this access token)
  oauth2Client.setCredentials({ access_token: accessToken });

  // Set up YouTube API
  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client,
  });

  try {
    console.log(`Uploading video`);
    const response = await youtube.videos.insert({
      part: "snippet,status",
      requestBody: videoMetadata,
      media: {
        body: fs.createReadStream(videoPath),
      },
    });

    console.log("Video uploaded successfully:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error uploading video:", err);
    throw err;
  }
};

const getToken = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens.access_token;
};

app.get("/auth/google", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/youtube"],
  });
  
  res.redirect(authUrl);
});

app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  try {
    const accessToken = await getToken(code);
    res.json({ accessToken });
  } catch (error) {
    console.error("Failed to obtain access token:", error);
    res.status(500).json({ message: "Failed to obtain access token" });
  }
});

app.post(
  "/upload-youtube-video",
  upload.single("youtubeVideo"),
  async (req, res) => {
    const { accessToken, title, description } = req.body;

    // Pastikan accessToken telah diberikan
    if (!accessToken) {
      return res
        .status(400)
        .json({ success: false, message: "Access token is required" });
    }

    // Pastikan file video telah diunggah
    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Video file is required" });
    }

    const videoMetadata = {
      title,
      description,
      privacyStatus: "public",
      videoPath: req.file.path,
    };

    try {
      const data = await uploadVideoToYoutube(accessToken, videoMetadata);
      console.log(`Value Data : ${data}`);
      res.json({
        message: `Video uploaded successfully: ${data}`,
        success: true,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({
        message: `Error uploading video: ${err.message}`,
        success: false,
      });
    }
  }
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
