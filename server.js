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
    crendentials: true,
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

app.post(
  "/upload-youtube-video",
  upload.single("youtubeVideo"),
  async (req, res) => {
    res.json({ message: "success" });
    // const { accessToken, title, description } = req.body;
    // const videoData = {
    //   title,
    //   description,
    //   privacyStatus: "public",
    //   videoPath: "",
    // };
    // try {
    //   const data = await uploadVideoToYoutube(accessToken, videoData);
    //   console.log(`Value Data : ${data}`);
    //   res.json({ message: `Video uploaded successfully: ${data}` });
    // } catch (err) {
    //   console.error(err.message);
    //   res.json({ message: `Error uploading video: ${err.message}` });
    // }
  }
);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
