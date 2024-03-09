const axios = require("axios");

const ACCESS_TOKEN =
  "EAAVDGKi9R7ABOZC0ZCUObZBLHXFOeY3aLDf9QZCuiGDCxehTtAt0ImHMEOkuBKhvUrJwe4vJW12agExgkJ4YkHfstDUcV3X2omkDmaqWbea1IfzIgL6M0ZAPEZAADfIwcopGbmrkUm3VtgejkJiisprhtQUgt49ww3ZCIuDIl9nrX3jPF3A9c3ZA63CCdHKZB8Uc78ckJ3Bv1QdnevB63sY96w1jKxAZDZD";
const PAGE_ID = "1481148072806320";

const testInstagramApi = async () => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v19.0/17841400008460056/media?image_url=https://images.unsplash.com/photo-1703103449757-dc459d8e1678?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&caption=#amazon`
    );

    console.log(response.data);
  } catch (err) {
    console.log(err.message);
  }
};

testInstagramApi();
