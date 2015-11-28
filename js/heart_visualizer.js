// Generated by CoffeeScript 1.10.0
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.HeartVisualizer = (function() {
    function HeartVisualizer(audioInitializer) {
      this.Update = bind(this.Update, this);
      this.audioInitializer = audioInitializer;
      this.timer = 0;
      this.scene = new THREE.Scene;
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.bloomParams = {
        strength: 3,
        kernelSize: 12,
        sigma: 2.0,
        resolution: 512
      };
      this.noiseAmount = 0.0;
      this.ambientLight = new THREE.AmbientLight(0x404040);
      this.scene.add(this.ambientLight);
      this.pointLight = new THREE.PointLight(0xffffff, 1, 100);
      this.pointLight.position.set(10, 20, 20);
      this.scene.add(this.pointLight);
      this.skyBox = this.SkyBox();
      this.scene.add(this.skyBox);
      this.Hearts(40);
      this.beatDistortionEffect = false;
      this.camera.position.z = 20;
    }

    HeartVisualizer.prototype.Heart = function() {
      var heartMaterial, loader;
      heartMaterial = new THREE.MeshPhongMaterial({
        color: 0xff0000
      });
      loader = new THREE.OBJLoader;
      loader.load('models/heart.obj', (function(_this) {
        return function(object) {
          object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
              return child.material = heartMaterial;
            }
          });
          _this.heart = object;
          return _this.scene.add(object);
        };
      })(this));
    };

    HeartVisualizer.prototype.Hearts = function(number) {
      var heartMaterial, loader;
      this.hearts = [];
      heartMaterial = new THREE.MeshPhongMaterial({
        color: 0xff0011
      });
      loader = new THREE.OBJLoader;
      loader.load('models/heart.obj', (function(_this) {
        return function(object) {
          var i, j, newObject, ref;
          object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
              return child.material = heartMaterial;
            }
          });
          object.userData = {
            extraRotation: 0
          };
          object.rotation.set(_this.RandomFloat(0, Math.PI / 4), _this.RandomFloat(0, Math.PI / 4), 0);
          object.scale.set(0.25, 0.25, 0.25);
          for (i = j = 0, ref = number; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
            newObject = object.clone();
            _this.hearts.push(newObject);
            _this.scene.add(newObject);
          }
          return _this.SetHeartsPositions();
        };
      })(this));
    };

    HeartVisualizer.prototype.SetHeartsPositions = function() {
      var heart, j, k, len, len1, newPosition, overlapping, position, positions, ref;
      positions = [];
      ref = this.hearts;
      for (j = 0, len = ref.length; j < len; j++) {
        heart = ref[j];
        newPosition = new THREE.Vector3(this.RandomInt(-40, 40), this.RandomInt(-40, 40), this.RandomInt(-40, 40));
        overlapping = void 0;
        if (positions.length === 0) {
          overlapping = false;
        } else {
          overlapping = true;
        }
        while (overlapping) {
          newPosition = new THREE.Vector3(this.RandomInt(-40, 40), this.RandomInt(-40, 40), this.RandomInt(-40, 40));
          overlapping = false;
          for (k = 0, len1 = positions.length; k < len1; k++) {
            position = positions[k];
            if (newPosition.distanceTo(position) < 8) {
              overlapping = true;
            }
          }
        }
        positions.push(newPosition);
        heart.position.set(newPosition.x, newPosition.y, newPosition.z);
      }
    };

    HeartVisualizer.prototype.SkyBox = function() {
      var geometry, material, skybox;
      geometry = new THREE.BoxGeometry(500, 500, 500);
      material = new THREE.MeshBasicMaterial({
        color: 0x0411ff,
        side: THREE.BackSide
      });
      skybox = new THREE.Mesh(geometry, material);
      return skybox;
    };

    HeartVisualizer.prototype.Update = function(deltaTime) {
      var heartObject, j, k, len, len1, randomHeart, ref, ref1;
      this.timer += 0.01;
      if (this.heart != null) {
        this.heart.rotation.y = this.timer;
      }
      if (this.hearts != null) {
        ref = this.hearts;
        for (j = 0, len = ref.length; j < len; j++) {
          heartObject = ref[j];
          if (heartObject != null) {
            heartObject.rotation.y += 0.01 + heartObject.userData.extraRotation;
            heartObject.rotation.x += heartObject.userData.extraRotation;
            heartObject.userData.extraRotation = Math.max(0, heartObject.userData.extraRotation - 0.01);
            heartObject.scale.x = Math.max(heartObject.scale.x - 0.001, 0.25);
            heartObject.scale.y = Math.max(heartObject.scale.y - 0.001, 0.25);
            heartObject.scale.z = Math.max(heartObject.scale.z - 0.001, 0.25);
          }
        }
        if (this.audioInitializer.beatdetect.isKick()) {
          randomHeart = this.hearts[this.RandomInt(0, this.hearts.length)];
          if (randomHeart != null) {
            randomHeart.userData.extraRotation = 0.4;
          }
        }
        if (this.audioInitializer.beatdetect.isSnare()) {
          ref1 = this.hearts;
          for (k = 0, len1 = ref1.length; k < len1; k++) {
            heartObject = ref1[k];
            if (heartObject != null) {
              if (Math.random() < 0.33) {
                heartObject.scale.set(0.3, 0.3, 0.3);
              }
            }
          }
        }
      }
      this.camera.position.set(40 * Math.cos(this.timer * 0.5), 0, 40 * Math.sin(this.timer * 0.5));
      this.camera.lookAt(this.scene.position);
    };

    HeartVisualizer.prototype.RandomFloat = function(min, max) {
      return Math.random() * (max - min) + min;
    };

    HeartVisualizer.prototype.RandomInt = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    return HeartVisualizer;

  })();

}).call(this);
