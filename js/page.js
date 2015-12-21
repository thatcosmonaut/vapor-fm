// Generated by CoffeeScript 1.10.0
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Page = (function() {
    function Page() {
      this.CheckKeyUp = bind(this.CheckKeyUp, this);
      this.CheckKey = bind(this.CheckKey, this);
      this.TogglePause = bind(this.TogglePause, this);
      this.DecreaseVolume = bind(this.DecreaseVolume, this);
      this.IncreaseVolume = bind(this.IncreaseVolume, this);
      this.audioInitializer = new AudioInitializer();
      this.renderController = new RenderController(this.audioInitializer);
      window.addEventListener('resize', this.renderController.OnResize, false);
      window.addEventListener('audioLoaded', this.renderController.AudioLoadedHandler, false);
      this.renderController.Render();
      this.activated = false;
      this.paused = false;
      document.onkeydown = this.CheckKey;
      document.onkeyup = this.CheckKeyUp;
    }

    Page.prototype.IncreaseVolume = function() {
      this.audioInitializer.audioElement.volume = Math.min(Math.max(this.audioInitializer.audioElement.volume + 0.1, 0), 1);
      this.renderController.UpdateVolumeDisplay(this.audioInitializer.audioElement.volume * 10);
    };

    Page.prototype.DecreaseVolume = function() {
      this.audioInitializer.audioElement.volume = Math.min(Math.max(this.audioInitializer.audioElement.volume - 0.1, 0), 1);
      this.renderController.UpdateVolumeDisplay(this.audioInitializer.audioElement.volume * 10);
    };

    Page.prototype.TogglePause = function() {
      if (this.paused) {
        this.audioInitializer.LoadAndPlayAudio();
      } else {
        this.audioInitializer.StopAndUnloadAudio();
        this.renderController.Pause();
      }
      this.paused = !this.paused;
    };

    Page.prototype.CheckKey = function(e) {
      e = e || window.event;
      if (this.activated) {
        if (e.keyCode === 38) {
          this.IncreaseVolume();
        } else if (e.keyCode === 40) {
          this.DecreaseVolume();
        } else if (e.keyCode === 32) {
          this.TogglePause();
        } else if (e.keyCode === 39) {
          if (this.audioInitializer.loaded) {
            this.renderController.NextVisualizer();
          }
        } else if (e.keyCode === 37) {
          if (this.audioInitializer.loaded) {
            this.renderController.PreviousVisualizer();
          }
        } else if (e.keyCode === 73) {
          this.renderController.ShowInfo();
        } else {
          this.renderController.RouteKeyDownInput(e.keyCode);
        }
      } else {
        this.activated = true;
        this.audioInitializer.LoadAndPlayAudio();
        this.renderController.activeVisualizer.DisplayLoading();
        this.audioInitializer.audioElement.addEventListener('canplay', (function(_this) {
          return function() {
            return _this.renderController.Activate();
          };
        })(this));
      }
    };

    Page.prototype.CheckKeyUp = function(e) {
      e = e || window.event;
      this.renderController.RouteKeyUpInput(e.keyCode);
    };

    return Page;

  })();

  $(function() {
    return new Page;
  });

}).call(this);
