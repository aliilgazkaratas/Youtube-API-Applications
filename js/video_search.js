document.addEventListener('DOMContentLoaded', async function () {
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const videoList = document.getElementById('videoList');
    let currentPage = 1;

    searchButton.addEventListener('click', async function () {
        const searchTerm = searchInput.value;
        console.log('Search Term:', searchTerm);

        videoList.innerHTML = '<p>Loading...</p>';
        const maxResults = 5;
        const startIndex = (currentPage - 1) * maxResults;

        try {
            const apiKeyResponse = await fetch('../JSON/config.json');
            const apiKeyData = await apiKeyResponse.json();
            const apiKey = apiKeyData.apiKey;

            const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&q=${searchTerm}&maxResults=${maxResults}&startIndex=${startIndex}`;
            console.log('API URL:', apiUrl);

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error('Network response was not ok!')
            }

            const data = await response.json();
            console.log('API Response Data:', data);
            const videos = data.items;
            videoList.innerHTML = '';

            videos.forEach(video => {
                const videoId = video.id.videoId;
                const videoTitle = video.snippet.title;

                const videoElement = document.createElement('iframe');
                videoElement.width = '560';
                videoElement.height = '315';
                videoElement.src = `https://www.youtube.com/embed/${videoId}`;
                videoElement.title = videoTitle;

                videoList.appendChild(videoElement);
            });
        } catch (error) {
            console.error('Error:', error);
        }
    });

    document.getElementById('nextPageButton').addEventListener('click', function () {
        currentPage++;
        console.log('Current Page:', currentPage);
        searchButton.click();
    });

    document.getElementById('prevPageButton').addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            console.log('Current Page:', currentPage);
            searchButton.click();
        }
    });
});
