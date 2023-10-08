document.addEventListener('DOMContentLoaded', function () {
    console.log('Birthday.js loaded'); // Log when the script is loaded

    document.getElementById('findVideoButton').addEventListener('click', async function () {
        console.log('Find Video button clicked'); // Log when the button is clicked

        const birthday = document.getElementById('birthdayInput').value;
        console.log('Birthday:', birthday);

        try {
            const response = await fetch('../JSON/config.json');

            if (!response.ok) {
                throw new Error('Network response was not ok!')
            }

            const data = await response.json();
            const apiKey = data.apiKey;

            const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&q=&maxResults=1&type=video&videoEmbeddable=true&videoSyndicated=true&publishedAfter=${birthday}T00%3A00%3A00Z&publishedBefore=${birthday}T23%3A59%3A59Z&order=viewCount`;

            const apiResponse = await fetch(apiUrl);

            if (!apiResponse.ok) {
                throw new Error('API response was not ok!');
            }

            const videoData = await apiResponse.json();
            console.log('API Response Data:', videoData);

            const video = videoData.items[0];

            if (video) {
                const videoId = video.id.videoId;
                const videoTitle = video.snippet.title;

                const videoElement = document.createElement('iframe');
                videoElement.width = '560';
                videoElement.height = '315';
                videoElement.src = `https://www.youtube.com/embed/${videoId}`;
                videoElement.title = videoTitle;

                const randomVideo = document.getElementById('randomVideo');
                randomVideo.innerHTML = '';
                randomVideo.appendChild(videoElement);
            } else {
                const randomVideo = document.getElementById('randomVideo');
                randomVideo.innerHTML = '<p>No videos found.</p>';
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
});
