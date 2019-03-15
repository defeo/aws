function Clicker(provider) {
    this.provider = provider;
    this.user = null;

    var messages = {
        loginError: "Please login to see this poll.",
        unknownError: "Unknown error, please try again later.",
        submitError: "Could not submit poll, please try again later.",
        submit: "Send",
        submitted: "Sent",
        deadline: "You can modify your answer until ",
    };
    for (var m in provider.messages)
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
    this.loginMenu = $('#top-menu .elements-addon-clicker');
    this.loginMenu.on('clicker.login-change', function(e) {
        this.$('.submenu').innerHTML = '';
        if (clicker.user) {
            this.$('.title').textContent = clicker.user.user.profile.name || clicker.user.user._id;
            this.title = clicker.user.host;
            this.$('.submenu')
                .append('li <a href="#" class="rename-profile"><i class="fa fa-user"></i> <span class="title">Éditer nom</span></a>');
            this.$('.submenu')
                .append('li')
                .append('a <i class="fa fa-trophy"></i> <span class="title">Résultats</span>')
                .href = '../'.repeat(eLeMentS.page.url.split('/').length-2)
                + 'addons/clicker/results';
            this.$('.submenu')
                .append('li <a href="#" class="logout"><i class="fa fa-sign-out"></i> <span class="title">Logout</span></a>');
        } else {
            this.$('.title').textContent = 'Login';
            const sub = this.$('.submenu');
            provider.auths.forEach(function(m) {
                var anchor = sub.append('li').append('a');
                anchor.className = 'login-auth';
                anchor.href = m.host + m.path;
                anchor.dataset.host = m.host;
                if (m.icon)
                    anchor.append('i.fa.fa-' + m.icon);
                if (m.title)
                    anchor.append('span.title ' + m.title);
            });
        }
    });
    this.loginMenu.on('click', function(e) {
        window.localStorage['clicker.auth_host'] = this.dataset.host;
    }, '.login-auth');
    this.loginMenu.on('click', function(e) {
        clicker.logout();
        e.preventDefault();
        window.location.reload();
    }, '.logout');
    this.loginMenu.on('click', function(e) {
        var nom = prompt('Éditer nom', clicker.user.user.profile.name);
        clicker._authXHR(null, '/profile', clicker.user.token, function(data, xhr) {
            if (xhr.status == 200) {
                clicker.user.user.profile = data;
                window.sessionStorage['clicker.user'] = JSON.stringify(clicker.user);
                clicker.loginMenu.dispatchEvent(new Event('clicker.login-change'));
            } else {
                console.log(xhr.status, data);
            }
        }, function(e) {
            console.log(e);
        }, {
            name: nom
        });
        e.preventDefault();
    }, '.rename-profile');

    this._authXHR = function(host, path, token, next, onerr, data) {
        host = host || (this.user && this.user.host) || '';
        var xhr = new XMLHttpRequest();
        xhr.open(data !== undefined ? 'POST' : 'GET', host + path);
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
            next(null, this.user);
        } else if ((token = window.localStorage.getItem('clicker.token'))
                   && (host = window.localStorage.getItem('clicker.auth_host'))) {
            this._authXHR(host, '/token', token, (data, xhr) => {
                if (xhr.status == 200) {
                    this.user = data;
                    this.user.host = host;
                    window.sessionStorage['clicker.user'] = JSON.stringify(this.user);
                    window.localStorage['clicker.token'] = this.user.token;
                    next(null, this.user);
                } else {
                    next(data);
                }
            }, next);
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
        this._authXHR(null, url, this.user.token, (data, xhr) => {
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
                if (data.answers.length
                    && data.answers[data.answers.length-1].answer.choices.indexOf(answ._id) >= 0) {
                    input.setAttribute('checked', true);
                }
                if (!data.poll.can.answer) {
                    input.disabled = true;
                }
                choice.innerHTML += answ.answer;
            }
            
            var button = node
                .append('button.clicker-submit')
                .on('click', (e) => {
                    button.disabled = true;
                    var answers = node
                        .$$('input.clicker-choice:checked')
                        .map(function(input) {
                            return input.id.slice('clicker-choice-'.length);
                        });
                    this._authXHR(null, url, this.user.token, function(data, xhr) {
                        if (xhr.status == 200) {
                            console.log(data);
                            data.answers = data.result.answers.map(function(a) {
                                return { answer: a };
                            });
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
                });
            var buttonText = button.append('span ' + messages.submit);
            var buttonMark = button.append('span.clicker-grade.fa').append('span.fa-arrow-right');

            function grade(node, grade) {
                buttonMark.className = '';
                if (grade) {
                    node.classList.add('graded');
                    node.dataset['clickerGrade'] = JSON.stringify(grade);
                    if (grade.on ? grade.ok == grade.on : grade.ok) {
                        buttonMark.className = 'fa-check';
                    } else {
                        buttonMark.className = 'fa-close';
                    }
                } else {
                    buttonText.textContent = messages.submitted;
                }
            }
            
            if (data.answers.length) {
                grade(node, data.answers[data.answers.length-1].grade);
            }

            if (data.answers.length || !data.poll.multiChoice || !data.poll.can.answer) {
                button.disabled = true;
            }
            
            node.on('change', function(e) {
                if(data.poll.can.answer) {
                    button.disabled = false;
                    buttonText.textContent = messages.submit;
                    buttonMark.className = 'fa-arrow-right';
                }
            });

            if (typeof(data.poll.can.answer) == 'string')
                node
                .append('div.clicker-deadline ' + messages.deadline + ' ')
                .append('span ' + (new Date(data.poll.can.answer)).toLocaleString(false, {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                }));
        }, function(err) {
            node.append("p.clicker-error " + messages.unknownError);
            return console.error(err);
        });
    };
    
    this.loginMenu.on('clicker.login-change',
                      (e) => $$('.clicker-poll').forEach(
                          (poll) => this.injectPoll(poll.id.slice('clicker-'.length), poll)
                      ));
    
    var qs = window.location.parsed_querystring();
    if (qs.token !== undefined) {
        window.localStorage['clicker.token'] = qs.token;
        delete qs.token;
        history.replaceState({}, '',
                             '?' + Object.keys(qs).map(function(k) {
                                 return k + (qs[k] !== true ? '=' + qs[k] : '');
                             }).join('&'));
    }
    this.login((err, user) => {
        if (err) {
            this.logout();
            console.log(err);
        }
        this.loginMenu.dispatchEvent(new Event('clicker.login-change'));
    });
}

var clicker = new Clicker(eLeMentS.page.addons.clicker);
