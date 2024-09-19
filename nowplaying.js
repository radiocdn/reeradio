        const songUrl = "http://192.168.178.82/nowplaying.txt"; // Replace with your IP and file location
        let currentSong = "";

        function fetchNowPlaying() {
            fetch(songUrl)
                .then(response => response.text())
                .then(song => {
                    song = song.trim();  // Trim any extra spaces/newlines
                    if (song !== currentSong) {
                        updateNowPlaying(song);
                        currentSong = song;
                    }
                })
                .catch(err => {
                    console.error("Error fetching now playing data:", err);
                });
        }

        function updateNowPlaying(song) {
            const nowPlayingText = document.getElementById('nowPlayingText');
            const artistElement = document.getElementById('artist');
            const titleElement = document.getElementById('title');
            const albumCover = document.getElementById('albumCover');

            // Split song into artist and title using " - " as the delimiter
            const [artist, title] = song.split(" - ");

            // Apply fade-out animation before updating the text and cover
            nowPlayingText.classList.add('hidden');
            albumCover.classList.add('hidden');  // Apply the same fade-out animation to cover

            // Wait for fade-out animation to finish before updating
            setTimeout(() => {
                artistElement.textContent = artist ? artist : "Unknown Artist";
                titleElement.textContent = title ? title : "Unknown Title";

                // Fetch the album cover from Deezer's free CDN (replace spaces with %20 for URL)
                const deezerCoverUrl = `https://corsproxy.io?https://api.deezer.com/search?q=${encodeURIComponent(artist)} ${encodeURIComponent(title)}`;

                // Fetch the Deezer API and extract album cover
                fetch(deezerCoverUrl)
                    .then(response => response.json())
                    .then(data => {
                        if (data && data.data && data.data.length > 0) {
                            const albumCoverUrl = data.data[0].album.cover_medium;  // Medium-size cover
                            albumCover.style.backgroundImage = `url(${albumCoverUrl})`;
                        } else {
                            albumCover.style.backgroundImage = "https://res.cloudinary.com/xerosradio/image/upload/f_webp,q_auto/v1/RadioCDN/stations/Logo_ReeRadio_Achtergrond";  // Default no image
                        }

                        // Reapply the fade-in animation after updating cover
                        albumCover.classList.remove('hidden');
                        nowPlayingText.classList.remove('hidden');
                    })
                    .catch(err => {
                        console.error("Error fetching Deezer album cover:", err);
                        // If there's an error, still trigger the fade-in animation
                        albumCover.classList.remove('hidden');
                        nowPlayingText.classList.remove('hidden');
                    });
            }, 1000);  // Wait for 1 second (animation duration)
        }

        // Check every second for song updates
        setInterval(fetchNowPlaying, 1000);
