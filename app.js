require('dotenv').config();

const express = require('express');
const hbs = require('hbs');


// require spotify-web-api-node package here:

const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:

/* GET home page */

app.get('/', function (req, res, next) {
    res.render('index')
});

app.get('/artist-search', async function (req, res, next) {
    const { artist } = req.query;
    spotifyApi
  .searchArtists(artist)
  .then(data => {
    console.log('The received data from the API: ', data.body);
    res.render('artist-search-results', { artists : data.body.artists.items })
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:id', async function (req, res, next) {
    const { id } = req.params;
    spotifyApi.getArtistAlbums(id)
  .then(data => {
    console.log('Artist albums', data.body);
    res.render('albums', { albums: data.body.items })
  }) 
  .catch(err => console.error(err))
})

 app.get('/albums/:albumId/tracks', async function (req, res, next) {
     const { albumId } = req.params;
     spotifyApi.getAlbumTracks(albumId)
   .then(data => {
     console.log(data.body);
     res.render('viewtracks', {tracks: data.body.items})
   }) 
   .catch(err => console.error(err))
 })

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

module.exports = app;
