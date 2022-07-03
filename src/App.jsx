import "./App.css";
import Navbar from "./components/Navbar";
import Suggest from "./components/Suggest";
import Tracks from "./components/Tracks";
import options from "./options.json";

import Deso from "deso-protocol";
import { ThemeProvider, createTheme } from "@mui/material";

import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

import { useState, useEffect } from "react";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const deso = new Deso();

const client_id = process.env.REACT_APP_SPOTIFY_ID;
const client_secret = process.env.REACT_APP_SPOTIFY_SECRET;

async function login(setLoggedUser) {
    const user = await deso.identity.login();
    const pfpUrl = await getPfpUrl(user.key);
    const username = await getUsername(user.key);
    const loggedUser = {
        address: user.key,
        username: username,
        pfpUrl: pfpUrl,
    };
    setLoggedUser(loggedUser);
}

async function getPfpUrl(address) {
    return await deso.user.getSingleProfilePicture(address);
}

async function getUsername(address) {
    const request = {
        PublicKeyBase58Check: address,
    };
    const response = await deso.user.getSingleProfile(request);
    return response.Profile.Username;
}

async function getFollowers() {
    const request = {
        PublicKeyBase58Check:
            "BC1YLg6GftNYj4nNGy4iNkNAH1kAocChPCckwxGcgHBXE66ekJGc9zw",
        GetEntriesFollowingUsername: true,
        NumToFetch: 200,
    };
    const response = await deso.social.getFollowsStateless(request);
    return response.PublicKeyToProfileEntry;
}

function resolveAfter(ms) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("");
        }, ms);
    });
}

async function getUserSuggestions(address) {
    const prefix = "!DeScover";
    const suggestions = [];
    const request = {
        PublicKeyBase58Check: address,
        NumToFetch: 200,
    };
    const posts = (await deso.posts.getPostsForPublicKey(request)).Posts;
    posts.forEach(async (post) => {
        let p, type, url;
        if (post.Body.startsWith(prefix)) {
            [p, type, url] = post.Body.split("|");
            const trackId = await getTrackIdFromUrl(url);
            const rawTrack = await getTrack(trackId);
            const username = await getUsername(post.PosterPublicKeyBase58Check);
            const pfp = await getPfpUrl(post.PosterPublicKeyBase58Check);
            const artists = [];
            rawTrack.artists.forEach((a) => {
                artists.push(a.name);
            });
            const track = {
                id: trackId,
                title: rawTrack.name,
                artists: artists,
                duration: msToMinSec(rawTrack.duration_ms),
                date: rawTrack.album.release_date,
                url: url,
            };
            const suggestion = {
                hash: post.PostHashHex,
                user: post.PosterPublicKeyBase58Check,
                type: type,
                username: username,
                track: track,
                pfp: pfp,
            };
            suggestions.push(suggestion);
        }
    });
    await resolveAfter(630);
    return suggestions;
}

async function getAllSuggestions(setSuggestions) {
    const suggestions = [];
    const addresses = await getFollowers();
    for (const address in addresses) {
        const userSuggestions = await getUserSuggestions(address);
        suggestions.push(...userSuggestions);
    }
    setSuggestions(suggestions);
    return suggestions;
}

async function getToken() {
    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
                "Basic " +
                new Buffer(client_id + ":" + client_secret).toString("base64"),
        },
        body: new URLSearchParams({
            grant_type: "client_credentials",
        }),
    });
    const token = (await response.json()).access_token;
    return token;
}

async function getTrack(id) {
    const token = await getToken();
    const response = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    });
    const data = await response.json();
    return data;
}

function getTrackIdFromUrl(url) {
    return url.split("track/")[1].slice(0, 22);
}

function msToMinSec(ms) {
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

function App() {
    const [loggedUser, setLoggedUser] = useState(null);
    const [suggestOpen, setSuggestOpen] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    useEffect(() => {
        getAllSuggestions(setSuggestions);
    }, []);

    const particlesInit = async (main) => {
        console.log(main);
        await loadFull(main);
    };

    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <div>
                    <Navbar
                        handleLogin={() => login(setLoggedUser)}
                        handleOpenSuggest={() => setSuggestOpen(true)}
                        loggedUser={loggedUser}
                    />
                    <Suggest
                        open={suggestOpen}
                        handleSuggestClose={() => setSuggestOpen(false)}
                        deso={deso}
                        loggedUser={loggedUser}
                    />
                    {suggestions.length > 0 ? (
                        <div
                            style={{
                                position: "absolute",
                                left: "50%",
                                top: "50%",
                                transform: "translate(-50%, -50%)",
                            }}
                        >
                            <Tracks
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                                suggestions={suggestions}
                                loggedUser={loggedUser}
                                deso={deso}
                            />
                        </div>
                    ) : null}
                </div>
            </ThemeProvider>
            <div style={{ position: "absolute" }}>
                <Particles
                    id="tsparticles"
                    init={particlesInit}
                    options={options}
                />
            </div>
        </>
    );
}

export default App;
