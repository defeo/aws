function Clicker(provider) {
    this.provider = provider;
    this.user = null;

    var messages = {
	loginError: "Please login to see this poll.",
	unknownError: "Unknown error, please try again later.",
	submitError: "Could not submit poll, please try again later.",
	submit: "Send",
    };
    for (m in provider.messages)
	messages[m] = provider.messages[m];

    var shuffle = function(n) {
	var shuffle = Array(n).fill(0).map(function (x,i) { return i; });
	for (var i = n - 1; i > 0; i--) {
	    var j = Math.floor(Math.random() * (i + 1))
	    var temp = shuffle[i];
	    shuffle[i] = shuffle[j];
	    shuffle[j] = temp;
	}
	return shuffle;
    };
    
    const clicker = this;
    this.loginMenu = $('#top-menu .class-bp-addon-clicker');
    this.loginMenu.on('clicker.login-change', function(e) {
	this.$('.submenu').innerHTML = '';
	if (clicker.user) {
	    this.$('.title').textContent = clicker.user.uid.match(/[^:]*:(.*)/)[1];
	    this.$('.submenu')
		.append('li')
		.append('a <i class="fa fa-trophy"></i> <span class="title">Résultats</span>')
		.href = '../'.repeat(ClassBP.page.url.split('/').length-2)
		+ 'addons/clicker/results';
	    this.$('.submenu')
		.append('li <a href="#" class="logout"><i class="fa fa-sign-out"></i> <span class="title">Logout</span></a>');
	} else {
	    this.$('.title').textContent = 'Login';
	    const sub = this.$('.submenu');
	    provider.methods.forEach(function(m) {
		var anchor = sub.append('li').append('a');
		anchor.href = provider.host + m.path;
		if (m.icon)
		    anchor.append('i.fa.fa-' + m.icon);
		if (m.title)
		    anchor.append('span.title ' + m.title);
	    });
	}
    });
    this.loginMenu.on('click', function(e) {
	clicker.logout();
	e.preventDefault();
	window.location.reload();
    }, '.logout');

    this._authXHR = function(path, token, next, onerr, data) {
	var xhr = new XMLHttpRequest();
	xhr.open(data !== undefined ? 'POST' : 'GET', this.provider.host + path);
	xhr.responseType = 'json';
	if (token)
	    xhr.setRequestHeader('Authorization', 'bearer ' + token);
	xhr.onload = function(e) {
	    next(xhr.response, xhr);
	};
	xhr.onerror = onerr ? onerr : function(err) { console.log(err); };
	if (data)
	    xhr.setRequestHeader('Content-type', 'application/json');
	xhr.send(JSON.stringify(data));
    }
    
    this.login = function(next) {
	var token, user = JSON.parse(window.sessionStorage.getItem('clicker.user'));
	if (user !== null && user.expires > Date.now()) {
	    this.user = user;
	    next(null, this.user)
	} else if (token = window.localStorage.getItem('clicker.token')) {
	    this._authXHR('/token', token, (function(data, xhr) {
		if (xhr.status == 200) {
		    this.user = data;
		    window.sessionStorage['clicker.user'] = JSON.stringify(this.user);
		    window.localStorage['clicker.token'] = this.user.token;
		    next(null, this.user);
		} else {
		    next(data);
		}
	    }).bind(this), next);
	} else {
	    next();
	}
    }

    this.logout = function() {
	this.user = null;
	window.sessionStorage.removeItem('clicker.user');
	window.localStorage.removeItem('clicker.token');
    }

    this.injectPoll = function(id, node) {
	node.innerHTML = '';
	if (!this.user) {
	    node.append("p.clicker-error " + messages.loginError);
	    return console.error('Not logged in');
	}
	var url = '/answer/' + id;
	this._authXHR(url, this.user.token, (function(data, xhr) {
	    if (xhr.status != 200 && xhr.status != 403) {
		node.append("p.clicker-error " + messages.unknownError);
		return console.error(data);
	    }
	    console.log(data);
	    node.append('h3.clicker-title ' + data.poll.title);
	    node.append('div.clicker-question ' + data.poll.question);
	    var choices = node.append('ul.clicker-choices');
	    var shuf = shuffle(data.poll.choices.length);
	    console.log(shuf);
	    shuf.forEach(function (x) {
		makeChoice(choices, data, data.poll.choices[x]);
	    });
	    
	    function makeChoice(parent, data, answ) {
		var choice = parent
		    .append('li' + (answ.correct ? '.clicker-correct' : ''))
		    .append('label')
		    .append('div') 
		var input = choice
		    .append('input.clicker-choice#clicker-choice-' + answ._id);
		input.type = data.poll.multiChoice ? 'checkbox' : 'radio';
		input.name = 'clicker-' + id;
		if (data.answers) {
		    input.disabled = true;
		    if (data.answers[0].answer.choices.indexOf(answ._id) >= 0)
			input.setAttribute('checked', true);
		}
		choice.innerHTML += answ.answer;
	    }
	    
	    var button = node
		.append('button.clicker-submit ' + messages.submit)
		.once('click', (function(e) {
		    var answers = node
			.$$('input.clicker-choice:checked')
			.map(function(input) {
			    return input.id.slice('clicker-choice-'.length);
			});
		    this._authXHR(url, this.user.token, function(data, xhr) {
			if (xhr.status == 200) {
			    console.log(data);
			    data.answers = [{ answer: { choices: answers } }];
			    choices.innerHTML = "";
			    shuf.forEach(function (x) {
				makeChoice(choices, data, data.poll.choices[x]);
			    });
			    grade(node, data.grade);
			} else {
			    console.log(xhr.response);
			    alert(messages.submitError);
			}
		    }, null, answers);
		}).bind(this));
	    var buttonMark = button.append('span.clicker-grade.fa.fa-arrow-right')

	    function grade(node, grade) {
		node.$$('input, button').forEach(function (x) { x.disabled = true });
		node.classList.add('answered');
		node.dataset['clickerGrade'] = JSON.stringify(grade);
		var mark = buttonMark.classList;
		mark.remove('fa-arrow-right');
		if (grade.on ? grade.ok == grade.on : grade.ok) {
		    mark.add('clicker-success');
		    mark.add('fa-check');
		} else {
		    mark.add('fa-close');
		}
	    }
	    
	    if (data.answers) {
		grade(node, data.answers[0].grade);
	    } else if (!data.poll.multiChoice) {
		button.disabled = true;
		node.once('change', function(e) {
		    button.disabled = false;
		});
	    }
	}).bind(this), function(err) {
	    node.append("p.clicker-error " + messages.unknownError);
	    return console.error(err);
	});
    };
    
    this.loginMenu.on('clicker.login-change', (function (e) {
	$$('.clicker-poll').forEach((function(poll) {
	    this.injectPoll(poll.id.slice('clicker-'.length), poll);
	}).bind(this));
    }).bind(this));
    
    var qs = window.location.parsed_querystring();
    if (qs.token !== undefined) {
	window.localStorage['clicker.token'] = qs.token;
	delete qs.token;
	history.replaceState({}, '',
			     '?' + Object.keys(qs).map(function(k) {
				 return k + (qs[k] !== true ? '=' + qs[k] : '');
			     }).join('&'));
    }
    this.login((function(err, user) {
	if (err) {
	    this.logout();
	    console.log(err);
	}
	this.loginMenu.dispatchEvent(new Event('clicker.login-change'));
    }).bind(this));
}

var clicker = new Clicker(ClassBP.page.addons.clicker);
