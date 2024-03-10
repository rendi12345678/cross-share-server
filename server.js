require("dotenv").config();
const { google } = require("googleapis");
const fs = require("fs");
const { client_id, client_secret, redirect_uris } = process.env;

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

// Set access token (You need to obtain this access token)
const accessToken =
  "ya29.a0Ad52N39Nt_Tw0cbc3dsZHC8sghXEpdZ33bMJ3gXKHZNQ1eN6cVpI-pBvod6TIk4xDUcgDiEJA-TjuJZV5rSrcGnVZsyVdTJ5bWxJqpWh5C5Tk5SmxZO-udHPFgJAr8lf8WZMN-SbPo-F_YX-pR7kPYsq1VpwPz1KPRzXaCgYKAYESARISFQHGX2MifPl4_0tqcSB_qgJI_tniJw0171";
oauth2Client.setCredentials({ access_token: accessToken });

// Set up YouTube API
const youtube = google.youtube({
  version: "v3",
  auth: oauth2Client,
});

// Define video metadata
const videoMetadata = {
  snippet: {
    title: "Test Video",
    description: "This is a test video uploaded from Node.js.",
  },
  status: {
    privacyStatus: "public", // 'public', 'private', or 'unlisted'
  },
};

// Define video file path
const videoPath = "./assets/videos/pipres-demo.mp4";

console.log(`Uploading video...`);

const uploadVideoToYoutube = async (video) => {
  try {
    const res = await youtube.videos.insert({
      part: "snippet,status",
      requestBody: videoMetadata,
      media: {
        body: fs.createReadStream(videoPath),
      },
    });
    console.log("Video uploaded successfully:", res.data);
  } catch (err) {
    console.error("Error uploading video:", err);
  }
};
