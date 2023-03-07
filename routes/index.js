const express = require('express');
const router = express.Router();
const { login, callback, refreshToken, getTracks } = require('../controllers/authenticationLogin');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', login);

router.get('/callback', callback);

router.get('/refresh_token', refreshToken);

router.get('/tracks/:id', getTracks);

module.exports = router;
