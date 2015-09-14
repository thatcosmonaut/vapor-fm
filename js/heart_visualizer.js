// Generated by CoffeeScript 1.10.0
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.HeartVisualizer = (function() {
    function HeartVisualizer(audioInitializer) {
      this.OnResize = bind(this.OnResize, this);
      this.Render = bind(this.Render, this);
      this.RenderProcess = bind(this.RenderProcess, this);
      this.audioInitializer = audioInitializer;
      this.visualizerElement = $('#visualizer');
      this.timer = 0;
      this.scene = new THREE.Scene;
      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      this.ambientLight = new THREE.AmbientLight(0x404040);
      this.scene.add(this.ambientLight);
      this.pointLight = new THREE.PointLight(0xffffff, 1, 100);
      this.pointLight.position.set(10, 20, 20);
      this.scene.add(this.pointLight);
      this.renderer = new THREE.WebGLRenderer;
      this.renderer.setClearColor(0x07020a);
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.visualizerElement.append(this.renderer.domElement);
      this.Hearts(80);
      this.camera.position.z = 20;
      this.RenderProcess();
      return;
    }

    HeartVisualizer.prototype.Heart = function() {
      var heartMaterial, loader;
      heartMaterial = new THREE.MeshPhongMaterial({
        color: 0xff00000
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
        color: 0xff00000
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
      var heart, j, k, len, len1, newPosition, overlapping, position, positions, ref, results;
      positions = [];
      ref = this.hearts;
      results = [];
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
        results.push(heart.position.set(newPosition.x, newPosition.y, newPosition.z));
      }
      return results;
    };

    HeartVisualizer.prototype.RenderProcess = function() {
      var bloomPass, film, horizontalBlur, renderPass, renderTargetCube, renderTargetGlow, renderTargetParameters, verticalBlur, vignette;
      renderTargetParameters = {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat,
        stencilBuffer: false
      };
      renderTargetCube = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, renderTargetParameters);
      this.cubeComposer = new THREE.EffectComposer(this.renderer, renderTargetCube);
      renderPass = new THREE.RenderPass(this.scene, this.camera);
      this.cubeComposer.addPass(renderPass);
      renderTargetGlow = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, renderTargetParameters);
      this.glowComposer = new THREE.EffectComposer(this.renderer, renderTargetGlow);
      horizontalBlur = new THREE.ShaderPass(THREE.HorizontalBlurShader);
      horizontalBlur.uniforms['h'].value = 1.0 / window.innerWidth;
      verticalBlur = new THREE.ShaderPass(THREE.VerticalBlurShader);
      verticalBlur.uniforms['v'].value = 1.0 / window.innerHeight;
      this.glowComposer.addPass(renderPass);
      this.glowComposer.addPass(horizontalBlur);
      this.glowComposer.addPass(verticalBlur);
      this.glowComposer.addPass(horizontalBlur);
      this.glowComposer.addPass(verticalBlur);
      this.blendPass = new THREE.ShaderPass(THREE.AdditiveBlendShader);
      this.blendPass.uniforms['tBase'].value = this.cubeComposer.renderTarget1;
      this.blendPass.uniforms['tAdd'].value = this.glowComposer.renderTarget1;
      this.blendPass.uniforms['amount'].value = 2.0;
      this.blendComposer = new THREE.EffectComposer(this.renderer);
      this.blendComposer.addPass(this.blendPass);
      bloomPass = new THREE.BloomPass(3, 12, 2.0, 512);
      this.blendComposer.addPass(bloomPass);
      this.badTV = new THREE.ShaderPass(THREE.BadTVShader);
      this.badTV.uniforms['distortion'].value = 1.0;
      this.badTV.uniforms['distortion2'].value = 1.0;
      this.badTV.uniforms['speed'].value = 0.1;
      this.badTV.uniforms['rollSpeed'].value = 0.0;
      this.blendComposer.addPass(this.badTV);
      this.rgbEffect = new THREE.ShaderPass(THREE.RGBShiftShader);
      this.rgbEffect.uniforms['amount'].value = 0.0015;
      this.rgbEffect.uniforms['angle'].value = 0;
      this.blendComposer.addPass(this.rgbEffect);
      film = new THREE.ShaderPass(THREE.FilmShader);
      film.uniforms['sCount'].value = 800;
      film.uniforms['sIntensity'].value = 0.9;
      film.uniforms['nIntensity'].value = 0.4;
      film.uniforms['grayscale'].value = 0;
      this.blendComposer.addPass(film);
      vignette = new THREE.ShaderPass(THREE.VignetteShader);
      vignette.uniforms['darkness'].value = 1;
      vignette.uniforms['offset'].value = 1.1;
      vignette.renderToScreen = true;
      this.blendComposer.addPass(vignette);
    };

    HeartVisualizer.prototype.Render = function() {
      var heartObject, j, len, randomHeart, ref;
      requestAnimationFrame(this.Render);
      this.timer += 0.01;
      this.audioInitializer.analyser.getByteFrequencyData(this.audioInitializer.frequencyData);
      this.audioInitializer.analyser.getFloatTimeDomainData(this.audioInitializer.floats);
      this.audioInitializer.beatdetect.detect(this.audioInitializer.floats);
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
          }
        }
        if (this.audioInitializer.beatdetect.isKick()) {
          randomHeart = this.hearts[this.RandomInt(0, this.hearts.length)];
          if (randomHeart != null) {
            randomHeart.userData.extraRotation = 0.4;
          }
        }
      }
      this.camera.position.set(40 * Math.cos(this.timer * 0.5), 0, 40 * Math.sin(this.timer * 0.5));
      this.camera.lookAt(this.scene.position);
      this.cubeComposer.render(0.1);
      this.glowComposer.render(0.1);
      this.blendComposer.render(0.1);
    };

    HeartVisualizer.prototype.OnResize = function() {
      var renderH, renderW;
      renderW = window.innerWidth;
      renderH = window.innerHeight;
      this.camera.aspect = renderW / renderH;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(renderW, renderH);
      this.renderer.domElement.width = renderW;
      this.renderer.domElement.height = renderH;
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