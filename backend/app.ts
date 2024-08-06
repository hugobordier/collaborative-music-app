import express from 'express';
import passport from 'passport';
import { Strategy as SpotifyStrategy } from 'passport-spotify';

const app = express();
const port = process.env.PORT || 3000;

passport.use(new SpotifyStrategy({
    clientID: process.env.SPOTIFY_CLIENT_ID!,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
    callbackURL: 'http://localhost:8888/auth/spotify/callback'
}, (accessToken, refreshToken, expires_in, profile, done) => {
    // Logique d'authentification
}));

app.use(passport.initialize());

app.get('/auth/spotify', passport.authenticate('spotify'));

app.get('/auth/spotify/callback',
    passport.authenticate('spotify', { failureRedirect: '/' }),
    (req, res) => {
        // Authentification réussie
        res.redirect('/');
    }
);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
