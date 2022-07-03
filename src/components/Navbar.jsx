import React from "react";
import {
    AppBar,
    Container,
    Toolbar,
    Box,
    Button,
    Avatar,
    Typography,
    CardHeader,
} from "@mui/material";

function Navbar({ handleOpenSuggest, handleLogin, loggedUser }) {
    return (
        <div>
            <AppBar
                position="static"
                color="transparent"
                sx={{ backdropFilter: "blur(5px)", height: "67px" }}
            >
                <Container maxWidth="xl">
                    <Toolbar
                        disableGutters
                        sx={{ justifyContent: "space-between" }}
                    >
                        <Box>
                            <Typography variant="h5" color="#FFFFFF">
                                DeScover
                            </Typography>
                            <Typography variant="subtitle2" color="#FFFFFF">
                                powered by DeSo
                            </Typography>
                        </Box>
                        <Box sx={{ justifyContent: "space-between" }}>
                            <Button
                                sx={{ fontSize: 20, color: "white" }}
                                onClick={handleOpenSuggest}
                            >
                                Suggest
                            </Button>
                        </Box>
                        <Box
                            sx={{
                                display: "inline",
                            }}
                        >
                            {loggedUser == null ? (
                                <Button
                                    sx={{ fontSize: 20, color: "white" }}
                                    onClick={handleLogin}
                                >
                                    Login
                                </Button>
                            ) : (
                                <CardHeader
                                    sx={{ color: "white" }}
                                    avatar={
                                        <Avatar
                                            src={loggedUser.pfpUrl}
                                            sx={{
                                                display: "flex",
                                                gap: "1rem",
                                            }}
                                        />
                                    }
                                    title={loggedUser.username}
                                    subheader={
                                        loggedUser.address.slice(0, 5) +
                                        "..." +
                                        loggedUser.address.slice(-6, -1)
                                    }
                                />
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </div>
    );
}

export default Navbar;
