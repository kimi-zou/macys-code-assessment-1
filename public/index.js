async function fetchJsonAndCountWord() {
  try {
    const wordCounts = {};
    const response = await fetch('../test_feed.json');
    const json_data = await response.json();
    json_data.content.forEach((item) => {
      const bodyHtml = item.content.bodyHtml ? item.content.bodyHtml : '';
      const textContent = bodyHtml.replace(/<[^>]+>/g, '');
      const words = textContent.match(/\b\w+\b/g);
      if (words) {
        words.forEach((word) => {
          const lowerCaseWord = word.toLowerCase();
          wordCounts[lowerCaseWord] = (wordCounts[lowerCaseWord] || 0) + 1;
        });
      }
    });
    for (const word in wordCounts) {
      console.log(`${word}: ${wordCounts[word]}`);
    }
  } catch (error) {
    console.error('Error fetching or processing the JSON:', error);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const bottomAlignElement = document.getElementById('bottom--align');
  if (bottomAlignElement) {
    bottomAlignElement.style.position = 'absolute';
    bottomAlignElement.style.textAlign = 'center';
  }

  fetchJsonAndCountWord();
});
