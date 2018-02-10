class Recorder {
    constructor(opts) {
        const options = Object.assign({}, {
            constraints: {
                audio: true,
                video: { mediaSource: 'window' },
            },
            recorder: {
                mimeType: 'video/webm',
            },
        }, opts);
        
        navigator.mediaDevices.getUserMedia(options.constraints).then((stream) => {
            this.rec = new MediaRecorder(stream, options.recorder);
            this.buffer = [];
            this.chunks = [];
            this.thrash = [];
            this.video = document.createElement('video');
            document.body.appendChild(this.video);
            this.download = document.createElement('a');
            this.download.download = options.fileName || (new Date()).toISOString() + '.json';
            document.body.appendChild(this.download);
            this.video.style.display = this.download.style.display = 'none';
            
            this.rec.ondataavailable = (e) => {
                console.log('data');
                this.buffer.push(e.data);
                if (this.rec.state == 'inactive') {
                    this.chunks.push(new Blob(this.buffer, { type: this.rec.mimeType }));
                    this.buffer = [];
                    this.notifyVisu();
                }
            }
            this.rec.addEventListener('start', (e) => this.notifyVisu());
            this.rec.addEventListener('stop', (e) => this.notifyVisu());
            this.video.addEventListener('play', (e) => this.notifyVisu());
            this.video.addEventListener('pause', (e) => this.notifyVisu());
            
            this.keyboard();
            this.visu = null;

            window.addEventListener('message', (e) => {
                console.log(e);
                if (e.origin == window.origin && e.source === this.visu) {
                    if (e.data.action == 'update')
                        this.notifyVisu();
                }
            });
            window.addEventListener('beforeunload', (e) =>
                                    e.returnValue = this.buffer.length || this.chunks.length || null);
        }).catch(err => console.error(err));
    }

    record() {
        this.rec.state == 'inactive' && this.rec.start();
    }

    chunk() {
        this.rec.state == 'recording' && this.rec.stop();
    }

    toggle() {
        this.rec.state == 'recording' ? this.chunk() : this.record();
    }

    rewind() {
        if (this.rec.state == 'inactive' && this.chunks.length) {
            this.thrash.push(this.chunks.pop());
            this.notifyVisu();
        }
    }

    restore() {
        if (this.rec.state == 'inactive' && this.thrash.length) {
            this.chunks.push(this.thrash.pop());
            this.notifyVisu();
        }
    }

    save() {
        if (this.rec.state == 'inactive' && this.chunks.length) {
            const out = [];
            for (let c of this.chunks) {
                out.push(new Promise((resolve, reject) => {
                    const f = new FileReader();
                    f.readAsDataURL(c);
                    f.onload = () => resolve(f.result);
                }));
            }
            Promise.all(out).then((out) => {
                const blob = new Blob([JSON.stringify(out)], { type: 'application/json' });
                this.download.href = URL.createObjectURL(blob);
                this.download.click();
            });
        }
    }
    
    playLast(video=false) {
        if (this.video.paused && this.rec.state == 'inactive' && this.chunks.length) {
            this.video.src = URL.createObjectURL(this.chunks[this.chunks.length - 1]);
            this.video.play();
            if (video) {
                this.video.mozRequestFullScreen();
                this.video.style.display = 'block';
            }
        }
    }

    silence() {
        this.video.pause();
        this.video.style.display = 'none';
    }

    keyboard() {
        window.addEventListener('keydown', e => {
            switch (e.code) {
            case 'F1':
                this.record();
                break;
            case 'F2':
                this.toggle();
                break;
            case 'Backspace':
                e.ctrlKey ? e.shiftKey ? this.restore() : this.rewind() : null;
                break;
            case 'Space':
                e.ctrlKey ? this.playLast(e.shiftKey) : null;
                break;
            case 'KeyV':
                e.ctrlKey && e.shiftKey && this.visualisation();
                break;
            case 'KeyS':
                if (e.ctrlKey) {
                    this.save();
                    e.preventDefault();
                }
                break;
            }
        });
        window.addEventListener('keyup', e => {
            switch (e.code) {
            case 'F1':
                this.chunk();
                break;
            case 'Space':
                this.silence();
                break;
            }
        });
    }

    visualisation() {
        return this.visu = window.open(
            '../'.repeat(eLeMentS.page.url.split('/').length-2)
                + 'addons/recorder/visualisation',
            'RecorderVisualisation',
            'toolbar=0,menubar=0,location=0'
        );
    }

    notifyVisu() {
        if (this.visu && !this.visu.closed) {
            this.visu.postMessage({
                chunks: this.chunks.map((c) => c.size),
                thrash: this.thrash.map((c) => c.size),
                last: this.chunks[this.chunks.length - 1],
                recording: this.rec.state == 'recording',
                playing: !this.video.paused,
            }, window.origin);
        }
    }
}

//window.recorder = new Recorder();
