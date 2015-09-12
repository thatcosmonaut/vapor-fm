// Generated by CoffeeScript 1.10.0
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.AudioInitializer = (function() {
    function AudioInitializer() {
      this.GetAverageVolume = bind(this.GetAverageVolume, this);
      this.context = new AudioContext;
      this.analyser = this.context.createAnalyser();
      this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
      this.floats = new Float32Array(this.analyser.frequencyBinCount);
      this.beatdetect = new FFT.BeatDetect(1024, 44100);
      this.audioElement = document.getElementById('stream');
      this.audioElement.addEventListener('canplay', (function(_this) {
        return function() {
          var sampleRate, source;
          source = _this.context.createMediaElementSource(_this.audioElement);
          source.connect(_this.analyser);
          source.connect(_this.context.destination);
          sampleRate = _this.context.sampleRate;
          _this.beatdetect = new FFT.BeatDetect(_this.analyser.frequencyBinCount, sampleRate);
          _this.beatdetect.setSensitivity(500);
          _this.audioElement.play();
        };
      })(this));
    }

    AudioInitializer.prototype.GetAverageVolume = function(array) {
      var average, i, values;
      values = 0;
      average = void 0;
      i = 0;
      while (i < array.length) {
        values += array[i];
        i++;
      }
      average = values / array.length;
      return average;
    };

    return AudioInitializer;

  })();

}).call(this);