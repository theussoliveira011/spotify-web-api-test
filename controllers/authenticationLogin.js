const querystring = require('querystring');
const generateRandomString = require('../controllers/generateRandomString');
const request = require('request');
const api = require('../config/api');

const client_id = process.env.CLIENT_ID; // Your client id
const client_secret = process.env.CLIENT_SECRET; // Your secret
const redirect_uri = process.env.REDIRECT_URI; // Your redirect uri

const stateKey = 'spotify_auth_state';

module.exports = {
  login: (req, res) => {
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    // application requests authorization;
    let scope = 'user-read-private user-read-email';
    res.redirect('https://accounts.spotify.com/authorize?'+
      querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state      
      }));
  },

  callback: (req, res) => {

    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;
    
    // check state parameter
    if(state === null || state !== storedState){
      res.redirect('/#' + 
        querystring.stringify({
          error: 'state_mismatch'
        }));
    } else {
      res.clearCookie(stateKey);
      const authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: 'authorization_code'
        },
        headers: {
          'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
      };

      // request fresh and acess tokens
      request.post(authOptions, (error, response, body) => {
        if(!error && response.statusCode === 200){

          const access_token = body.access_token;
          const refresh_token = body.refresh_token;

          const options = {
            url: 'https://api.spotify.com/v1/me',
            headers: { 'Authorization': 'Bearer' + access_token },
            json: true
          };

          request.get(options, (error, response, body) => {
            console.log(body);
          });

          // pass the token to the browser to make requests from there

          res.redirect('/#' + 
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token
            }));

        } else {
          res.redirect('/#' + 
            querystring.stringify({
              error: 'invalid_token'
            }));
        }
      });
    }
  },

  // requesting acess token from refresh token
  refreshToken: (req, res) => {
    const refresh_token = req.query.refresh_token;
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: { 
        'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64')) 
      },
      form: {
        grant_type: 'refresh_token',
        refresh_token: refresh_token
      },
      json: true
    };

    request.post(authOptions, (error, response, body) => {
      if(!error && response.statusCode === 200){
        const access_token = body.access_token;
        res.send({
          'acess_token': access_token
        });
      }
    });
  },

  getTracks: async (req, res) => {
    const { id } = req.params;

    await api.get(`/tracks/${id}`)
      .then(response => {
        // 1TZzwEmqDQeZq7LAqLwfnY
        console.log(response.data.album.images[1].url);
        res.render('music', {response: response});
      });
  }
}