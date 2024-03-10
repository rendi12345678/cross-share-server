require("dotenv").config();
const express = require("express");
const app = express();
const { google } = require("googleapis");
const bodyParser = require("body-parser");
const fs = require("fs");
const { client_id, client_secret, redirect_uris } = process.env;

app.use(bodyParser.json());

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

// Define video file path
const videoPath = "./assets/videos/pipres-demo.mp4";

console.log(`Uploading video...`);

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

app.post("/upload-video", async (req, res) => {
  const { accessToken, title, description, privacyStatus } = req.body;
  const videoData = {
    title,
    description,
    privacyStatus,
    videoPath,
  };

  try {
    const data = await uploadVideoToYoutube(accessToken, videoData);
    res.json({ message: `Video uploaded successfully: ${data}` });
  } catch (err) {
    console.error(err);
    res.json({ message: `Error uploading video: ${err}` });
  }
});
