console.log('popup.js is now running');

function getScoreFromBackground() {
  chrome.runtime.sendMessage({ type: 'getScore' }, function(response) {
    if (response.status === 'success') {
      console.log('Retrieved score:', response.data);
      document.getElementById('progress').innerText = JSON.stringify(response.data, Object.keys(response.data).sort(), 2);
    } else {
      console.error('Error retrieving score:', response.message);
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  getScoreFromBackground();
});