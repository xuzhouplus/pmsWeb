const AudioVisualizerCanvas = function () {
	this.file = null; //the current file
	this.fileName = null; //the current file name
	this.audioContext = null;
	this.source = null; //the audio source
	this.infoUpdateId = null; //to store the setTimeout ID and clear the interval
	this.animationId = null;
	this.status = 0; //flag for sound is playing 1 or stopped 0
	this.forceStop = false;
	this.allCapsReachBottom = false;
	this.stopEvent = null
};
AudioVisualizerCanvas.prototype = {
	options: {},
	analyser: null,
	init: function (options) {
		this.options = options;
		this._prepareAPI();
		this._drawSpectrum();
		this._prepareFile();
	},
	play: function () {
		this._start();
	},
	replay: function () {
		this._start();
	},
	pause: function () {
		this.audioContext.suspend();
	},
	resume: function () {
		this.audioContext.resume();
	},
	stop: function () {
		this.audioContext.suspend();
	},
	close: function () {
		this.audioContext.close();
	},
	isPlaying:function () {
		return this.audioContext.state;
	},
	_prepareFile: function () {
		let that = this;
		that.stopEvent = this.options.onended;
		fetch(this.options.audio).then(res => res.blob().then(blob => {
			that.file = blob;
			if (that.status === 1) {
				that.forceStop = true;
			}
			that.options.onload();
		}));
	},
	_prepareAPI: function () {
		//fix browser vender for AudioContext and requestAnimationFrame
		window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
		window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
		window.cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame;
		try {
			this.audioContext = new AudioContext();
		} catch (e) {
			console.log(e);
		}
	},
	_start: function () {
		//read and decode the file into audio array buffer
		const that = this,
			file = this.file,
			fr = new FileReader();
		fr.onload = function (e) {
			const fileResult = e.target.result;
			const audioContext = that.audioContext;
			if (audioContext === null) {
				return;
			}
			// that._updateInfo('Decoding the audio', true);
			audioContext.decodeAudioData(fileResult, function (buffer) {
				that._visualize(audioContext, buffer);
			}, function (e) {
				console.error(e);
			});
		};
		fr.onerror = function (e) {
			console.error(e);
		};
		//assign the file to the reader
		fr.readAsArrayBuffer(file);
	},
	_visualize: function (audioContext, buffer) {
		const audioBufferSouceNode = audioContext.createBufferSource(),
			analyser = audioContext.createAnalyser(),
			that = this;
		analyser.fftSize = 512;
		//connect the source to the analyser
		audioBufferSouceNode.connect(analyser);
		//connect the analyser to the destination(the speaker), or we won't hear the sound
		analyser.connect(audioContext.destination);
		//then assign the buffer to the buffer source node
		audioBufferSouceNode.buffer = buffer;
		//play the source
		if (!audioBufferSouceNode.start) {
			audioBufferSouceNode.start = audioBufferSouceNode.noteOn //in old browsers use noteOn method
			audioBufferSouceNode.stop = audioBufferSouceNode.noteOff //in old browsers use noteOff method
		}
		//stop the previous sound if any
		if (this.animationId !== null) {
			cancelAnimationFrame(this.animationId);
		}
		if (this.source !== null) {
			this.source.stop(0);
		}
		audioBufferSouceNode.start(0);
		this.status = 1;
		this.source = audioBufferSouceNode;
		audioBufferSouceNode.onended = function () {
			that.analyser = null;
			that.status = 0;
			that._drawSpectrum();
			that._audioEnd(that);
		};
		this.analyser = analyser;
		this._drawSpectrum();
	},
	_drawSpectrum: function () {
		const PI = Math.PI;
		const canvas = document.getElementById('audio-visualizer-canvas');
		const ctx = canvas.getContext('2d');
		const cwidth = canvas.width;
		const cheight = canvas.height;
		const cr = 200;//环形半径
		const minHeight = 2;
		const meterWidth = 5;
		const meterNum = 180;//设置方块的数量，考虑到闭环的关系
		const gradient = ctx.createLinearGradient(0, -cr, 0, -cwidth / 2);
		gradient.addColorStop(0, '#0f0');
		gradient.addColorStop(0.5, '#ff0');
		gradient.addColorStop(1, '#f00');
		ctx.fillStyle = gradient;

		const render = () => {
			let array;
			let step;
			if (this.analyser) {
				array = new Uint8Array(this.analyser.frequencyBinCount);
				this.analyser.getByteFrequencyData(array);
				step = Math.round(array.length / meterNum);
			} else {
				array = [];
				step = Math.round(256 / meterNum)
			}
			ctx.clearRect(0, 0, cwidth, cheight);
			ctx.save();
			ctx.translate(cwidth / 2, cheight / 2);
			for (let i = 0; i < meterNum; i++) {
				const value = array[i * step];
				const meterHeight = value * (cheight / 2 - cr) / 256 || minHeight;
				ctx.rotate(2 * PI / meterNum);
				ctx.fillRect(-meterWidth / 2, -cr - meterHeight, meterWidth, meterHeight);
			}
			ctx.restore();
			if (this.analyser) {
				this.animationId = requestAnimationFrame(render);
				if (this.status === 0) {
					cancelAnimationFrame(this.animationId); //since the sound is stoped and animation finished, stop the requestAnimation to prevent potential memory leak,THIS IS VERY IMPORTANT!
				}
			} else {
				cancelAnimationFrame(this.animationId);
			}
		}
		this.animationId = requestAnimationFrame(render);
	},
	_audioEnd: function (instance) {
		if (this.forceStop) {
			this.forceStop = false;
			this.status = 1;
		} else {
			this.status = 0;
		}
		if ((typeof this.stopEvent) == 'function') {
			this.stopEvent();
		}
	}
}

export default AudioVisualizerCanvas;