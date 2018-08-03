const express = require('express');
const parser = require('body-parser');
const path = require('path');

const app = express();

const htmlR = require('./app/routing/htmlRoutes.js');
const apiR = require('./app/routing/apiRoutes.js');
const friends = require('./app/data/friends.js');

const PORT = process.env.PORT || 3000;

app.use(parser.urlencoded({ extended: true }));
app.use(parser.json());

app.use(express.static(path.join(__dirname, './app/public')))

htmlR(app, path);
apiR(app);

module.exports.lookForFriends = function () {
	let scoreArray = [];
    let current = apiR.user;
    
    for (let i = 0; i < friends.array.length; i++) {
		let friendScore = 0;
		if (friends.array[i].name !== current.name) {

            for (let j = 0; j < friends.array[i].scores.length; j++) {
				let score = friends.array[i].scores[j];
				let difference = Math.abs(score - current.scores[j])
				friendScore+=difference;
            }
            
            let friendObj = {};
			friendObj.friend = friends.array[i];
			friendObj.score = friendScore;
			scoreArray.push(friendObj)
		}
	}

    scoreArray.sort(function (a,b) {
		return a.score - b.score;
	});
	return scoreArray[0]
}

app.listen(PORT, function() {
    console.log("App listening on http://localhost:" + PORT);
  });
