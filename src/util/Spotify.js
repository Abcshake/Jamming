import { trackPromise } from 'react-promise-tracker';
const clientId = process.env.REACT_APP_clientId;
const redirectURI = 'http://localhost:3000/';
let accessToken;
const Spotify = {
    getAccessToken(){
        if(accessToken){
            return accessToken;
        }
        // check for access token match. href refers to the url that in found within the window object
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        if(accessTokenMatch && expiresInMatch){
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            //This clears the parameter, allowing us to grab a new access token when it expires.
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location = accessUrl;
        }

    },
    search(term){
        const accessToken = Spotify.getAccessToken();
        return trackPromise(
        fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            mode: 'cors'
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artists: track.artists[0].name,
                album: track.album.name,
                uri: track.uri,
                preview: track.preview_url,
                image: track.album.images[2].url
            }));
        }));
    },

 
    savePlaylist(name, trackUris){
        if(!name || !trackUris.length) {
            return;
        }
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`};
        let userId;
        return fetch('https://api.spotify.com/v1/me', 
        {
             headers: headers
        }).then(response => { 
            return response.json();
        }).then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
            {
                  headers: headers,
                  method: 'POST', 
                  body: JSON.stringify({ name: name })
            }).then(response => {
                return response.json();
            }).then(jsonResponse => {
                const playlistId = jsonResponse.id;
                console.log(playlistId);
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
                {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({ uris: trackUris })
                })
            }) // end of playlist response
        }) // end of userId response
    } // of savePlaylist method
}; // end of spotify function expression 
export default Spotify;