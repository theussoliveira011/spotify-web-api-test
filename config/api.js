// curl --request GET \
//   --url https://api.spotify.com/v1/tracks/id \
//   --header 'Authorization: ' \
//   --header 'Content-Type: application/json'

const axios = require("axios");

const api = axios.create({
  baseURL: 'https://api.spotify.com/v1',
  timeout: 1000,
  headers: {
    'Authorization': `Bearer ${ process.env.ACCESS_TOKEN }`,
    'Content-Type': 'application/json'
  }
});

module.exports = api;

