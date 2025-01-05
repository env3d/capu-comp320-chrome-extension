console.log("moodle_assignment.js is now running");
// tinymce.editors.id_onlinetext_editor.setContent('asdf')

function getScoreFromBackground(assignment_title) {
    chrome.runtime.sendMessage({ type: 'getScore' }, function (response) {
        if (response.status === 'success') {
            totalScore = 0;
            numScores = 0;
            console.log('Retrieved score:', response.data);
            score = ['total', ...Object.keys(response.data)].filter(key => 
                key.includes(assignment_title) || key == 'total'
            ).map( key => {
                if (key.startsWith('prev_') && key.endsWith('._')) {
                    totalScore += response.data[key];
                    numScores++;
                }
                return [ key, response.data[key] || 0 ]
            }).reduce( (obj, [key, value]) => {
                obj[key] = value;
                return obj;
            }, {});            
            score['total'] = (numScores > 0 ? totalScore/numScores : 0).toFixed(2);
            score = JSON.stringify(score, null, 2);            
            console.log(score);
            id_submissionstatement.checked = true;
            id_onlinetext_editor.value = score;
        } else {
            console.error('Error retrieving score:', response.message);
        }
    });
}

window.addEventListener('load', function () {
    console.log('title: ' + document.title);
    if (document.title.includes("SQLZoo") && document.title.includes("Edit submission")) {
        console.log("SQLZoo Assignment Detected");
        // Extract the assignmen title from the page title
        const regex = 'SQLZoo (.*) Assignment';
        const match = document.title.match(regex);
        if (match && match[1]) {
            getScoreFromBackground(match[1]);
        }
    }
});