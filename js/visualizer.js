// Generated by CoffeeScript 1.10.0
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.Visualizer = (function() {
    function Visualizer(audioInitializer) {
      this.Update = bind(this.Update, this);
      var i;
      this.audioInitializer = audioInitializer;
      this.timer = 0;
      this.xRotationDirection = 1;
      this.yRotationDirection = -1;
      this.scene = new THREE.Scene;
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.bloomParams = {
        strength: 1.0,
        strengthIncrease: 0,
        kernelSize: 12.0,
        sigma: 1.5,
        resolution: 512
      };
      this.noiseAmount = 0.0;
      this.ambientLight = new THREE.AmbientLight(0x404040);
      this.scene.add(this.ambientLight);
      this.pointLight = new THREE.PointLight(0xffffff, 1, 100);
      this.pointLight.position.set(10, 20, 20);
      this.scene.add(this.pointLight);
      this.skyBox = this.SkyBox();
      this.cube = this.Cube();
      this.lineBoxes = this.LineBoxes();
      this.scene.add(this.skyBox);
      this.RomanBust();
      i = 0;
      while (i < this.lineBoxes.length) {
        this.scene.add(this.lineBoxes[i]);
        i++;
      }
      this.beatDistortionEffect = true;
      this.camera.position.z = 6;
      return;
    }

    Visualizer.prototype.Cube = function() {
      var cube, geometry, material;
      geometry = new THREE.BoxGeometry(3, 3, 3);
      material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: false
      });
      cube = new THREE.Mesh(geometry, material);
      return cube;
    };

    Visualizer.prototype.RomanBust = function() {
      var bustMaterial, loader;
      this.bustMinScale = 0.14;
      bustMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff
      });
      loader = new THREE.OBJLoader;
      return loader.load('models/romanbust.obj', (function(_this) {
        return function(object) {
          object.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
              return child.material = bustMaterial;
            }
          });
          object.scale.set(_this.bustMinScale, _this.bustMinScale, _this.bustMinScale);
          object.position.set(0, -3.5, 0);
          _this.bust = object;
          return _this.scene.add(_this.bust);
        };
      })(this));
    };

    Visualizer.prototype.LineBoxes = function() {
      var i, lineBox, lineBoxGeometry, lineBoxes, lineMaterial;
      lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: 2
      });
      lineBoxes = [];
      i = 0;
      while (i < 20) {
        lineBoxGeometry = new THREE.Geometry;
        lineBoxGeometry.vertices.push(new THREE.Vector3(-20, 10, -10));
        lineBoxGeometry.vertices.push(new THREE.Vector3(20, 10, -10));
        lineBoxGeometry.vertices.push(new THREE.Vector3(20, -10, -10));
        lineBoxGeometry.vertices.push(new THREE.Vector3(-20, -10, -10));
        lineBoxGeometry.vertices.push(new THREE.Vector3(-20, 10, -10));
        lineBox = new THREE.Line(lineBoxGeometry, lineMaterial);
        lineBoxes[i] = lineBox;
        i++;
      }
      return lineBoxes;
    };

    Visualizer.prototype.SkyBox = function() {
      var geometry, material, skybox;
      geometry = new THREE.BoxGeometry(500, 500, 500);
      material = new THREE.MeshBasicMaterial({
        color: 0x1100ff,
        side: THREE.BackSide
      });
      skybox = new THREE.Mesh(geometry, material);
      return skybox;
    };

    Visualizer.prototype.Update = function(deltaTime) {
      var i, rotationAddition, scaleValue;
      this.timer += 0.01;
      rotationAddition = this.audioInitializer.GetAverageVolume(this.audioInitializer.frequencyData) / 2000;
      if (this.bust != null) {
        this.bust.rotation.y += (0.01 + rotationAddition) * this.yRotationDirection;
        scaleValue = 0.142;
        if (this.audioInitializer.beatdetect.isKick()) {
          this.bust.scale.set(scaleValue, scaleValue, scaleValue);
          this.yRotationDirection = Math.random() < 0.5 ? -1 : 1;
        } else {
          this.bust.scale.x = Math.max(this.bust.scale.x - 0.001, this.bustMinScale);
          this.bust.scale.y = Math.max(this.bust.scale.y - 0.001, this.bustMinScale);
          this.bust.scale.z = Math.max(this.bust.scale.z - 0.001, this.bustMinScale);
        }
      }
      i = 0;
      while (i < this.lineBoxes.length) {
        this.lineBoxes[i].scale.x = ((this.timer + (i * 0.5)) * 0.2) % 1.5;
        this.lineBoxes[i].scale.y = ((this.timer + (i * 0.5)) * 0.2) % 1.5;
        i++;
      }
    };

    Visualizer.prototype.HandleKeyDownInput = function(keyCode) {};

    Visualizer.prototype.HandleKeyUpInput = function(keyCode) {};

    return Visualizer;

  })();

}).call(this);
