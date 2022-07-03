import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    CardActions,
    Button,
    Popover,
    Slider,
    Box,
    Divider,
} from "@mui/material";

import { useState } from "react";

async function sendDiamonds(amount, loggedUser, suggestion, deso) {
    const request = {
        SenderPublicKeyBase58Check: loggedUser.address,
        ReceiverPublicKeyBase58Check: suggestion.user,
        DiamondPostHashHex: suggestion.hash,
        DiamondLevel: amount,
        MinFeeRateNanosPerKB: 1000,
    };
    const response = await deso.social.sendDiamonds(request);
    console.log(response);
}

function Info({ suggestion, loggedUser, deso }) {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? "popover" : undefined;

    const [amount, setAmount] = useState(1);
    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    return (
        <div>
            <Card sx={{ width: 400, height: 470, borderRadius: 10 }}>
                <CardMedia
                    component="img"
                    height="140"
                    image={suggestion.pfp}
                />
                <CardContent>
                    <Typography gutterBottom variant="h4" component="div">
                        {suggestion.track.title}
                    </Typography>
                    <Divider light />
                    {suggestion.track.artists.map((artist) => (
                        <Typography variant="h6" color="text.secondary">
                            {artist}
                        </Typography>
                    ))}
                    <Typography variant="subtitle1" color="text.secondary">
                        Duration: {suggestion.track.duration}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Release date: {suggestion.track.date}
                    </Typography>
                    <Typography variant="subtitle1" color="text.primary">
                        Suggested by {suggestion.username}
                    </Typography>
                </CardContent>
                <Divider light />
                <CardActions>
                    <Button size="medium" onClick={handleClick}>
                        Send Diamonds
                    </Button>
                </CardActions>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                    }}
                >
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        minHeight="120px"
                        minWidth="250px"
                    >
                        <Slider
                            aria-label="diamonds"
                            defaultValue={1}
                            valueLabelDisplay="auto"
                            value={amount}
                            onChange={handleAmountChange}
                            step={1}
                            marks
                            min={1}
                            max={6}
                            sx={{ width: 150 }}
                        />
                        <Button
                            onClick={async () => {
                                await sendDiamonds(
                                    amount,
                                    loggedUser,
                                    suggestion,
                                    deso
                                );
                                handleClose();
                            }}
                        >
                            Send
                        </Button>
                    </Box>
                </Popover>
            </Card>
        </div>
    );
}

export default Info;
