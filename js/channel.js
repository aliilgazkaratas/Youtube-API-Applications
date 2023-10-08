document.addEventListener('DOMContentLoaded', function () {
    const idInput = document.getElementById('channelIdInput'); // Change the element ID

    const commonWordsList = document.getElementById('commonWordsList');

    const getCommonWords = async () => {
        const channelId = idInput.value; // Change the variable name
        try {
            const apiKeyResponse = await fetch('../JSON/config.json');
            const apiKeyData = await apiKeyResponse.json();
            const apiKey = apiKeyData.apiKey;

            const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=10&order=viewCount&type=video&videoDefinition=high&key=${apiKey}`);
            if (!response.ok) {
                throw new Error('Network response was not ok!')
            }
            const data = await response.json();
            const videoTitles = data.items.map(item => item.snippet.title);
            const wordCounts = countWords(videoTitles.join(' '));
            const sortedWords = Object.keys(wordCounts).sort((a, b) => wordCounts[b] - wordCounts[a]);
            commonWordsList.innerHTML = '';
            sortedWords.slice(0, 10).forEach((word, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = `${index + 1}. ${word}`;
                commonWordsList.appendChild(listItem);
            });
        } catch (error) {
            console.error('Error:', error);
            commonWordsList.textContent = 'Error fetching common words';
        }
    };

    const calculateButton = document.getElementById('calculateButton');
    calculateButton.addEventListener('click', getCommonWords);

    // Create a MutationObserver
    const observer = new MutationObserver(() => {
        // Call the getCommonWords function when DOM changes are detected
        getCommonWords();
    });

    // Define what to observe (in this case, changes to the idInput element)
    const config = { attributes: true, childList: true, subtree: true };
    observer.observe(idInput, config);

    // Function to disconnect the observer if needed
    function disconnectObserver() {
        observer.disconnect();
    }

    // Example of disconnecting the observer
    // Uncomment this line if you need to disconnect the observer at some point
    // disconnectObserver();
});

function countWords(text) {
    return text.split(/\s+/).reduce((counts, word) => {
        counts[word] = (counts[word] || 0) + 1;
        return counts;
    }, {});
}
