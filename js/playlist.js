document.addEventListener('DOMContentLoaded', async function () {
    const urlInput = document.getElementById('playlistUrlInput');
    const durationDisplay = document.getElementById('playlistDuration');

    const calculatePlaylistDuration = async () => {
        const playlistUrl = urlInput.value;
        const playlistId = getPlaylistIdFromUrl(playlistUrl);

        if (!playlistId) {
            durationDisplay.textContent = 'Invalid playlist URL';
            return;
        }

        try {
            const apiKeyResponse = await fetch('../JSON/config.json');
            const apiKeyData = await apiKeyResponse.json();
            const apiKey = apiKeyData.apiKey;

            const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${playlistId}&key=${apiKey}`);
            
            if (!response.ok) {
                throw new Error('Network response was not ok!');
            }

            const data = await response.json();
            const items = data.items;

            let totalDurationInSeconds = 0;

            for (const item of items) {
                const videoDuration = item.contentDetails.duration;
                totalDurationInSeconds += convertVideoDurationToSeconds(videoDuration);
            }

            const totalDurationHours = Math.floor(totalDurationInSeconds / 3600);
            const totalDurationMinutes = Math.floor((totalDurationInSeconds % 3600) / 60);

            durationDisplay.textContent = `Total Duration: ${totalDurationHours} hours and ${totalDurationMinutes} minutes`;
        } catch (error) {
            console.error('Error:', error);
            durationDisplay.textContent = 'Error calculating duration';
        }
    };

    const calculateButton = document.getElementById('calculateButton');
    calculateButton.addEventListener('click', calculatePlaylistDuration);

    function getPlaylistIdFromUrl(url) {
        const regex = /[?&]list=([^&]+)/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    function convertVideoDurationToSeconds(duration) {
        const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
        const matches = duration.match(regex);

        const hours = parseInt(matches[1]) || 0;
        const minutes = parseInt(matches[2]) || 0;
        const seconds = parseInt(matches[3]) || 0;

        return hours * 3600 + minutes * 60 + seconds;
    }
});
