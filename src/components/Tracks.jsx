import { useState } from "react";
import Player from "./Player";
import { IconButton } from "@mui/material";
import Info from "./Info";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import ArrowBackIosNewSharpIcon from "@mui/icons-material/ArrowBackIosNewSharp";

function Tracks({ suggestions, loggedUser, deso }) {
    const [index, setIndex] = useState(0);

    const handleNext = () => {
        setIndex((index + 1) % suggestions.length);
    };

    const handlePrev = () => {
        setIndex((index - 1 + suggestions.length) % suggestions.length);
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div>
                    <IconButton onClick={handlePrev}>
                        <ArrowBackIosNewSharpIcon fontSize="large" />
                    </IconButton>
                </div>
                <div>
                    <Player id={suggestions[index].track.id} />
                </div>
                <div>
                    <Info
                        suggestion={suggestions[index]}
                        loggedUser={loggedUser}
                        deso={deso}
                    />
                </div>
                <div>
                    <IconButton onClick={handleNext}>
                        <ArrowForwardIosSharpIcon fontSize="large" />
                    </IconButton>
                </div>
            </div>
        </div>
    );
}

export default Tracks;
