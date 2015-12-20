// Generated by CoffeeScript 1.10.0
(function() {
  this.NoiseVisualizer = (function() {
    function NoiseVisualizer() {
      this.scene = new THREE.Scene;
      this.camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0.1, 1000);
      this.noiseAmount = 1.0;
      return;
    }

    NoiseVisualizer.prototype.Update = function() {};

    NoiseVisualizer.prototype.HandleKeyDownInput = function(keyCode) {};

    NoiseVisualizer.prototype.HandleKeyUpInput = function(keyCode) {};

    NoiseVisualizer.prototype.Activate = function() {};

    return NoiseVisualizer;

  })();

}).call(this);
