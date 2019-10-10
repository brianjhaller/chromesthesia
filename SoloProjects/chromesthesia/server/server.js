const express = require('express')
const request = require('request')
const querystring = require('querystring')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const path = require('path')
const Sequelize = require('sequelize');
const Op = Sequelize.Op
require('dotenv').config();

const Track = require('./database/database.js')
const app = express();


let redirect_uri = process.env.REDIRECT_URI || 'http://localhost:8888/callback'

// Uncomment to auto-drop tables on restart of server
// Track.sync({force: true}, {logging: console.log})

app.use(bodyParser.urlencoded({ extended: true }), cookieParser())
   .use(bodyParser.json())
   .use(cors({ origin: true, credentials: true}))

app.use(express.static(path.resolve(__dirname, '../dist')));
app.use(express.json());

app.post('/save-color', (req, res) => {
  let { red, green, blue, track, artist, album, trackUri, spotifyId } = req.body;
  Track.create({red: red, green: green, blue: blue, trackUri: trackUri, track: track, artist: artist, album: album, spotifyId: spotifyId }).then(data => {});
  res.json(req.body);
});

app.post('/pull-data', async (req, res) => {
  let { redMin, redMax, greenMin, greenMax, blueMin, blueMax, spotifyId } = req.body;
  let results = await Track.findAll({
    where: {
      red: { 
        [Op.between]: [redMin, redMax]
      },
      green: { 
        [Op.between]: [greenMin, greenMax]
      },
      blue: { 
        [Op.between]: [blueMin, blueMax]
      },
      spotifyId: spotifyId
    },
  });
  let resultArray = [];
  results.forEach(result => {
    resultArray.push(result.dataValues.trackUri)
  });
  res.send(resultArray);
});

app.post('/destroy-data', (req, res) => {
  let { spotifyId } = req.body;
  Track.destroy({
    where: {
      spotifyId: spotifyId
    },
  });
});

app.post('/destroy-song', (req, res) => {
  let { trackUri } = req.body;
  Track.destroy({
    where: {
      trackUri: trackUri
    },
  });
});

app.post('/login', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: process.env.CLIENT_ID,
      scope: 'user-top-read user-read-private playlist-modify-private user-read-email user-read-currently-playing user-modify-playback-state',
      redirect_uri
    }));
});

app.get('/callback', function(req, res) {
  let code = req.query.code || null
  let authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (new Buffer(
        process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET
      ).toString('base64'))
    },
    json: true
  }
  request.post(authOptions, function(error, response, body) {
    var access_token = body.access_token;
    let uri = process.env.FRONTEND_URI || 'http://localhost:8888';
    process.env.ACCESS_TOKEN = access_token;
    res.redirect(uri + '?access_token=' + access_token);
  })
})

let port = process.env.PORT || 8888
console.log("Listening on port", port + ".")
app.listen(port);