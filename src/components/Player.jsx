function Player({ id }) {
    return (
        <iframe
            title="player"
            src={`https://open.spotify.com/embed/track/${id}`}
            width="400"
            height="470"
            frameBorder="0"
            allowtransparency="true"
            allow="encrypted-media"
            style={{ borderRadius: 43 }}
            id="embed-iframe"
        ></iframe>
    );
}

export default Player;
