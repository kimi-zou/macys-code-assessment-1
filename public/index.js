async function fetchJsonAndCountWord(path) {
  try {
    const wordCounts = {};
    const response = await fetch(path);
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
    return wordCounts;
  } catch (error) {
    console.error('Error fetching or processing the JSON:', error);
  }
}

function sortWordCount(wordCounts) {
  const wordCountsArray = Object.entries(wordCounts);
  return wordCountsArray.sort((a, b) => b[1] - a[1]);
}

async function paintWordCountChart() {
  try {
    const wordCounts = await fetchJsonAndCountWord('../test_feed.json');
    const sortedWordCount = sortWordCount(wordCounts);
    const context = document.getElementById('wordCountChart').getContext('2d');
    const labels = sortedWordCount.map((subarray) => subarray[0]);
    const counts = sortedWordCount.map((subarray) => subarray[1]);
    new Chart(context, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Word Count',
            data: counts,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        indexAxis: 'y',
      },
    });
  } catch (error) {
    console.error('Error painting word count chart:', error);
  }
}

document.addEventListener('DOMContentLoaded', async function () {
  const bottomAlignElement = document.getElementById('bottom--align');
  if (bottomAlignElement) {
    bottomAlignElement.style.position = 'absolute';
    bottomAlignElement.style.textAlign = 'center';
  }

  await paintWordCountChart();
});
