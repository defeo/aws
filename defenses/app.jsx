/******************************************************/
var Project = React.createClass({
    getDefaultProps: function() {
	return {
	    gid: -1,
	    data: {
		description: 'DOE John (demo project)',
		workspace: null,
		github: null
	    },
	    closeBtn: null,
	};
    },

    stopClick: function(e) {
	if (e.target.tagName == "A") e.stopPropagation();
    },
    
    render: function() {
	var c9 = this.props.data.workspace;
	var run = this.props.data.run
	? this.props.data.run
	: (c9
	    ? (function(url) {
		url = url.map(function(s) {
		    return s.replace(/[^a-z0-9-]/g, '-').replace(/^-+/, '');
		});
		return "https://" + url[1] + '-' + url[0] + ".c9users.io/";
	    })(c9.split("/"))
	    : null);
	var github = this.props.data.github;
	
	return (
	    <div className="project" onClick={this.props.onClick}>
	    <div className="description">{this.props.data.description}</div>

	    <div className="buttons" onClick={this.stopClick}>
	    {c9 ? (
		<a className="c9" href={"https://ide.c9.io/" + c9} target="_blank" title="Cloud9">C9</a>
	    ) : null}
	    
	    {run ? (
		<a className="run" href={run} target="_blank" title="Lancer">run</a>
	    ) : null}
	    
	    {github ? (
		<a className="github" href={"https://github.com/" + github} target="_blank" title="GitHub">GitHub</a>
	    ) : null}
	    
	    {this.props.closeBtn ? (
		<a className="close" onClick={this.props.closeBtn} title="Annuler">close</a>
	    ) : null}	    
	    </div>
	    </div>
	);
    }
});


/******************************************************/
var Slot = React.createClass({
    getDefaultProps: function() {
	return {
	    time: null,
	    project: null,
	    booking: null,
	    auth: null,
	    selected: false,
	    empty: null,
	}
    },
    
    taken: function() {
	return !!this.props.booking;
    },

    editable: function() {
	return !this.props.booking || this.props.booking.uid == (this.props.auth && this.props.auth.uid);
    },

    mine: function() {
	return this.taken() && this.editable();
    },
    
    handleClick: function() {
	return this.props.onClick(this.taken(), this.editable());
    },
    
    render: function() {
	var classes = classNames({
	    slot: true,
	    selected: this.props.selected,
	    taken: this.taken(),
	    editable: this.editable(),
	});
	var style = {
	    top: (this.props.time.getHours() - 13 + this.props.time.getMinutes() / 60) * 4 + 'em'
	};
	
	return (
	    <div className={classes} style={style} onClick={this.handleClick}>
	    <div className="time">
	    {Intl.DateTimeFormat('fr-FR', {
		hour12:false,
		hour: 'numeric',
		minute:'2-digit'
	    }).format(this.props.time)}
	    </div>
	    <div className="info">
	    {this.props.project ? (
		<Project gid={this.props.booking.gid} data={this.props.project}
		closeBtn={this.mine() ? this.props.empty : null} />
	    ) : null}
	    </div>
	    </div>
	);
    }
});


/******************************************************/
var Typeahead = React.createClass({
    getInitialState: function() {
	return {
	    filter: "",
	};
    },
    
    getDefaultProps: function() {
	return {
	    projects: {},
	    callback: false,
	};
    },

    getActive: function() {
	return Object.keys(this.props.projects).reduce((function(comps, gid) {
	    var p = this.props.projects[gid];
	    if (p.description.toLowerCase().match(this.state.filter))
		comps.push({ gid: gid, data: p });
	    return comps;
	}).bind(this), []);
    },
    
    componentDidMount: function() {
	this.refs.input.getDOMNode().focus();
    },
    
    handleChange: function(e) {
	this.setState({
	    filter: e.target.value,
	});
    },

    handleKeys: function(e) {
	if (!(e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)) {
	    if (e.key == "ArrowDown" || e.key == "ArrowUp") {
	    } else if (this.props.callback && (e.key == "Enter" || e.key == "Escape")) {
		this.props.callback(e.key == "Enter" ? null : null);
	    }
	}
    },

    outClick: function() {
	this.props.callback(null);
    },

    elementClick: function(gid, e) {
	this.props.callback(gid);
    },

    stopClick: function(e) {
	e.stopPropagation();
    },
    
    render: function() {
	var projects = this.getActive().map(function(p) {
	    return (
		<div key={p.gid} className="li">
		<Project  gid={p.gid} data={p.data}
		onClick={this.elementClick.bind(this, p.gid)} />
		</div>
	    );
	}, this);
	
	return (
	    <div className="typeahead" onClick={this.outClick}>
	    <div className="container" onClick={this.stopClick}>
	    <input ref="input" type="text" value={this.state.filter}
	    placeholder="search"
	    onChange={this.handleChange} onKeyDown={this.handleKeys} />
	    {projects}
	    </div>
	    </div>
	);
    }
});


/******************************************************/
var Slots = React.createClass({
    getInitialState: function() {
	return {
	    slots : [],
	    auth : null,
	    selected: null,
	    showList: document.location.hash == '#list',
	};
    },

    getDefaultProps: function() {
	return {
	    firebase: null,
	    projects: {},
	};
    },

    setCalendar: function(start, increments) {
	var slots = increments.map(function(i) {
		return { time: new Date(start + i) }
	});
	console.log(slots);
	return this.props.firebase.update({ slots: slots });
    },
    
    componentDidMount: function() {
	this.props.firebase.on('value', (function(snapshot) {
	    var state = snapshot.val()
	    console.log("got data", state);
	    this.setState(state);
	}).bind(this));
	
	var authCb = (function(error, auth) {
	    if (error) {
		console.log(error);
	    } else {
		console.log('Authenticated as: ', auth.uid);
		this.setState({ auth: auth });
	    }
	}).bind(this);
	this.props.firebase.onAuth((function(auth) {
	    if (!auth) {
		this.props.firebase.authAnonymously(authCb);
	    } else {
		authCb(null, auth);
	    }
	}).bind(this));

	window.addEventListener('hashchange', this.handleHash);
    },
    
    select: function(id, taken, editable) {
	if (editable) {
	    this.setState({
		selected: null,
		showList: (function(gid) {
		    if (gid !== null) {
			this.props.firebase.child("slots/" + id).update({
			    booking: {
				uid: this.state.auth && this.state.auth.uid,
				gid: gid,
			    }
			});
		    }
		    this.setState({ showList: false });
		}).bind(this)
	    });
	} else {
	    this.setState({ selected: id });
	}
    },

    empty: function(id) {
	this.props.firebase.child("slots/" + id + "/booking").remove();
    },

    handleHash: function() {
	this.setState({ showList: document.location.hash == "#list" });
    },
    
    render: function() {
	var slots = this.state.slots.map(function(s, i) {
	    return (
		<Slot key={i} auth={this.state.auth}
		selected={this.state.selected === i}
		time={new Date(s.time)} booking={s.booking}
		project={s.booking ? this.props.projects[s.booking.gid] : null}
		onClick={this.select.bind(this, i)} empty={this.empty.bind(this, i)} />
	    );
	}, this).sort(function(a, b) {
	    return a.props.time - b.props.time;
	});

	var days = new Map();
	slots.forEach(function(s) {
	    var day = Intl.DateTimeFormat('fr-FR', {
		weekday:'long',
		day: 'numeric',
		month:'long'
	    }).format(s.props.time);
	    (days.get(day) || days.set(day, []).get(day)).push(s);
	});

	var groups = []
	days.forEach(function(slots, day) {
	    groups.push(<div className="day" key={day}>
		<div className="header">{day}</div>
		<div className="slots">{slots}</div>
		</div>);
	});

	return (
	    <div>
	    <div className="main">{groups}</div>
	    {this.state.showList ? (
		<Typeahead projects={this.props.projects}
		callback={this.state.showList === true ? null : this.state.showList}/>
	    ) : null }
	    </div>
	);
    }
});


/******************************************************/
var slots = React.createElement(Slots, {
    firebase: new Firebase('https://defeo-aws.firebaseio.com/defenses/2017-uvsq'),
    projects: window.groups,
});

React.render(slots, document.getElementById('component'));
