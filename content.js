console.log("content.js is now running");

function getScores() {
  // Retrieve scores from local storage
  scores = {};
  Object.keys(localStorage).filter(
    item => item.startsWith('prev_')
  ).forEach(
    item => {
      const val = localStorage.getItem(item);      
      try {
        const valjson = JSON.parse(val);
        scores[item] = valjson.score ? valjson.score : 0;  
      } catch (e) {
        scores[item] = val;
      }
    }
  );

  // Asychronously save the score into the background script
  chrome.runtime.sendMessage({ type: 'saveScore', data: scores }, (response) => {
    if (response.status === 'success') {
      console.log('Score saved successfully');
    } else {
      console.error('Error saving score:', response.message);
    }
  });

  return scores;
}

document.querySelectorAll('.submitSQL').forEach(b => {
  b.addEventListener('click', function () {
    setTimeout(getScores, 1000);
  });
});

window.addEventListener('load', function () {
  getScores();
});