function timeline(answers) {
    var timeline = answers.filter(function (a) {
	return a !== null;
    }).map(function (a) {
	var answ = a.answers[0];
	return {
	    poll: a.poll,
	    date: new Date(answ.answer.date),
	    correct: answ.grade.on !== undefined ? (answ.grade.ok == answ.grade.on) : answ.grade.ok,
//	    ratio: answ.grade.on ? answ.grade.ok / answ.grade.on : null,
	    grade: answ.grade,
//	    choices: answ.answer.choices,
	}
    });
    timeline.sort(function(a, b) {
	return a.date - b.date;
    });
    return timeline;
}

function _grade(timeline, deadline) {
    var freeze = timeline.reduce(function (stats, a) {
	if (a.date <= deadline) {
	    if (["56a7ab9487b68f1300ba90ae", "56a7a68087b68f1300ba90a3",
		 "56a7a34a87b68f1300ba909b", "56a7a8f187b68f1300ba90a8",
		 "56a6b6d387b68f1300ba9088", "56a6b6d387b68f1300ba9091"].indexOf(a.poll._id) == -1) {
		stats.total++;
		stats.correct += a.correct;
	    }
	} else {
	    stats.outoftime++;
	}
	return stats;
    }, { total: 0, correct: 0, outoftime: 0 });
    console.log(freeze);
    return Math.min(Math.round((2 * freeze.total + 4 * freeze.correct)*10/22)/10, 6);
}

function gradeUVSQ(timeline) {
    return _grade(timeline, new Date('2016-03-15T13:00:00'));
}
function gradeISTY(timeline) {
    return _grade(timeline, new Date('2016-04-17T13:00:00'));
}

function gradeAll(users, grading) {
    users.forEach(function(u) {
	clicker._authXHR('/stats/user/' + u._id, clicker.user.token, function(answers, xhr) {
	    u.grade = grading(timeline(answers));
	}, function(err) {
	    console.log(err);
	});
    });
}
