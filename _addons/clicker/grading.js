function timeline(answers) {
    var timeline = answers.map(function (a) {
	var answ = a.answers[a.answers.length - 1];
	var ret = {
	    poll: a.poll,
	    date: new Date(answ.answer.date),
//	    ratio: answ.grade.on ? answ.grade.ok / answ.grade.on : null,
	    grade: answ.grade,
//	    choices: answ.answer.choices,
	};
	if (ret.grade) {
	    ret.correct = answ.grade.on !== undefined
		? (answ.grade.ok == answ.grade.on)
		: answ.grade.ok;
	    ret.score = answ.grade.on !== undefined
		? 2 * answ.grade.ok / answ.grade.on - 1
		: Number(answ.grade.ok);
	} else {
        // If answer is ungraded (too soon), assume it is wrong
        ret.correct = false;
        ret.score = 0;
    }
	return ret;
    });
    timeline.sort(function(a, b) {
	return a.date - b.date;
    });
    return timeline;
}

function count(quizzes) {
    return quizzes.reduce((c, l) => c + l.quizzes.length, 0);
}

function grade(timeline, total) {
    var answered = timeline.length;
    var score = timeline.reduce(function(sum, a) { return sum + a.score; }, 0);

    console.log(total, answered, score);
    return Math.round((2 * answered + 4 * score)/total * 10)/10;
}

function gradeAll(users, total) {
    return users.map((u) => new Promise((resolve, reject) => {
	    clicker._authXHR(null, '/stats/user/' + u._id, clicker.user.token, (answers, xhr) => {
	        u.grade = grade(timeline(answers), total);
            resolve(u);
	    }, (err) => {
	        console.log(err);
            reject(err);
	    });
    }));
}

function downloadGrades(since=Date.now() - 1000*60*60*24*90) {
    return Promise.all(gradeAll(users, count(quizzes)))
        .then((users) => window.open(
            URL.createObjectURL(new Blob(
                [users
                 .filter(u => u.lastSeen > Date.now() - 1000*60*60*24*90)
                 .map(u => `${u._id},${u.profile.name},${u.grade}`)
                 .join('\n')]))));
}
