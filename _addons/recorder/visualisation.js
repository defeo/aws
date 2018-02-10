class Visualiser {
    constructor() {
        this.opener = window.opener;
        this.origin = window.origin;

        this.recordLed = document.querySelector('#recording');
        this.playLed = document.querySelector('#playing');
        this.waveform = document.querySelector('#waveform');
        this.chunks = document.querySelector('#chunks .blocks');
        this.thrash = document.querySelector('#thrash .blocks');

        window.addEventListener('message', (e) => {
            console.log(e);
            if (e.origin == this.origin && e.source == this.opener)
                this.refresh(e.data);
        });
        this.opener.postMessage({ action: "update" }, this.origin);
    }

    refresh(data) {
        this.recordLed.classList.toggle('active', data.recording);
        this.playLed.classList.toggle('active', data.playing);

        if (data.last) {
            const ctx = new AudioContext();
            const f = new FileReader();
            f.readAsArrayBuffer(data.last);
            f.onload = () => ctx.decodeAudioData(f.result)
                .then(b => this.drawWave(b.getChannelData(0)));
        }
        
        const blocks = (list) => {
            const tot = list.reduce((a,b) => a+b, 0);
            return list.reduce((p,s) => `${p}<span style="width:${s/tot*90}%"></span>`, '');
        }
        this.chunks.innerHTML = blocks(data.chunks);
        this.thrash.innerHTML = blocks(data.thrash);
        this.chunks.lastChild.classList.add('selected');
    }

    drawWave(data) {
        ((w, c) => {
            console.log(data.length);
            c.clearRect(0, 0, w.width, w.height);
            c.beginPath();
            c.moveTo(0, w.height/2);
            for (let i = 0; i < data.length; i++) {
                c.lineTo((i+1) * w.width / data.length, (2*data[i]+1)*w.height/2);
            }
            c.stroke();
        })(this.waveform, this.waveform.getContext("2d"));
    }
}

const visualiser = new Visualiser();
