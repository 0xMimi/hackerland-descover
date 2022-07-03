import React from "react";
import { useState } from "react";

import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    FormControl,
} from "@mui/material";

function Suggest({ open, handleSuggestClose, loggedUser, deso }) {
    const [url, setUrl] = useState("");

    const handleUrlChange = (e) => {
        setUrl(e.target.value);
    };

    const submit = async (url) => {
        const request = {
            UpdaterPublicKeyBase58Check: loggedUser.address,
            BodyObj: {
                Body: `!DeScover|explore|${url}`,
                VideoURLs: [],
                ImageURLs: [],
            },
        };
        const response = await deso.posts.submitPost(request);
        console.log(response);
    };

    const follow = async () => {
        const request = {
            FollowerPublicKeyBase58Check: loggedUser.address,
            FollowedPublicKeyBase58Check:
                "BC1YLg6GftNYj4nNGy4iNkNAH1kAocChPCckwxGcgHBXE66ekJGc9zw",
            IsUnfollow: false,
            MinFeeRateNanosPerKB: 1000,
        };
        const response = await deso.social.createFollowTxnStateless(request);
        console.log(response);
    };

    return (
        <div>
            <Dialog open={open}>
                <DialogTitle>Suggest</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Suggest a song recommendation
                    </DialogContentText>
                    <FormControl variant="standard">
                        <Button variant="contained" onClick={() => follow()}>
                            Follow
                        </Button>
                        <TextField
                            label="Spotify URL"
                            type="string"
                            margin="dense"
                            required
                            value={url}
                            onChange={handleUrlChange}
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            handleSuggestClose();
                            setUrl("");
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => {
                            submit(url);
                            handleSuggestClose();
                            setUrl("");
                        }}
                        disabled={url === ""}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Suggest;
