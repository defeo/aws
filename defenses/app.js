/******************************************************/
var Project = React.createClass({displayName: "Project",
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
	    React.createElement("div", {className: "project", onClick: this.props.onClick}, 
	    React.createElement("div", {className: "description"}, this.props.data.description), 

	    React.createElement("div", {className: "buttons", onClick: this.stopClick}, 
	    c9 ? (
		React.createElement("a", {className: "c9", href: "https://ide.c9.io/" + c9, target: "_blank", title: "Cloud9"}, "C9")
	    ) : null, 
	    
	    run ? (
		React.createElement("a", {className: "run", href: run, target: "_blank", title: "Lancer"}, "run")
	    ) : null, 
	    
	    github ? (
		React.createElement("a", {className: "github", href: "https://github.com/" + github, target: "_blank", title: "GitHub"}, "GitHub")
	    ) : null, 
	    
	    this.props.closeBtn ? (
		React.createElement("a", {className: "close", onClick: this.props.closeBtn, title: "Annuler"}, "close")
	    ) : null	    
	    )
	    )
	);
    }
});


/******************************************************/
var Slot = React.createClass({displayName: "Slot",
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
	    React.createElement("div", {className: classes, style: style, onClick: this.handleClick}, 
	    React.createElement("div", {className: "time"}, 
	    Intl.DateTimeFormat('fr-FR', {
		hour12:false,
		hour: 'numeric',
		minute:'2-digit'
	    }).format(this.props.time)
	    ), 
	    React.createElement("div", {className: "info"}, 
	    this.props.project ? (
		React.createElement(Project, {gid: this.props.booking.gid, data: this.props.project, 
		closeBtn: this.mine() ? this.props.empty : null})
	    ) : null
	    )
	    )
	);
    }
});


/******************************************************/
var Typeahead = React.createClass({displayName: "Typeahead",
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
		React.createElement("div", {key: p.gid, className: "li"}, 
		React.createElement(Project, {gid: p.gid, data: p.data, 
		onClick: this.elementClick.bind(this, p.gid)})
		)
	    );
	}, this);
	
	return (
	    React.createElement("div", {className: "typeahead", onClick: this.outClick}, 
	    React.createElement("div", {className: "container", onClick: this.stopClick}, 
	    React.createElement("input", {ref: "input", type: "text", value: this.state.filter, 
	    placeholder: "search", 
	    onChange: this.handleChange, onKeyDown: this.handleKeys}), 
	    projects
	    )
	    )
	);
    }
});


/******************************************************/
var Slots = React.createClass({displayName: "Slots",
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
		React.createElement(Slot, {key: i, auth: this.state.auth, 
		selected: this.state.selected === i, 
		time: new Date(s.time), booking: s.booking, 
		project: s.booking ? this.props.projects[s.booking.gid] : null, 
		onClick: this.select.bind(this, i), empty: this.empty.bind(this, i)})
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
	    groups.push(React.createElement("div", {className: "day", key: day}, 
		React.createElement("div", {className: "header"}, day), 
		React.createElement("div", {className: "slots"}, slots)
		));
	});

	return (
	    React.createElement("div", null, 
	    React.createElement("div", {className: "main"}, groups), 
	    this.state.showList ? (
		React.createElement(Typeahead, {projects: this.props.projects, 
		callback: this.state.showList === true ? null : this.state.showList})
	    ) : null
	    )
	);
    }
});


/******************************************************/
var slots = React.createElement(Slots, {
    firebase: new Firebase('https://defeo-aws.firebaseio.com/defenses/2017-uvsq'),
    projects: window.groups,
});

React.render(slots, document.getElementById('component'));
