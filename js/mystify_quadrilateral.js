// Generated by CoffeeScript 1.10.0
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  this.MystifyQuadrilateral = (function() {
    function MystifyQuadrilateral(leftBound, rightBound, topBound, bottomBound) {
      this.SetQuadrilateralFireInYDirectionTimeout = bind(this.SetQuadrilateralFireInYDirectionTimeout, this);
      this.SetQuadrilateralFireInXDirectionTimeout = bind(this.SetQuadrilateralFireInXDirectionTimeout, this);
      this.FireQuadrilateralsInYDirection = bind(this.FireQuadrilateralsInYDirection, this);
      this.FireQuadrilateralsInXDirection = bind(this.FireQuadrilateralsInXDirection, this);
      this.IsLastVertexToCollide = bind(this.IsLastVertexToCollide, this);
      this.ChangeColors = bind(this.ChangeColors, this);
      this.SetColorChangeTimeout = bind(this.SetColorChangeTimeout, this);
      this.RandomColorChangeTime = bind(this.RandomColorChangeTime, this);
      this.Update = bind(this.Update, this);
      this.Quadrilaterals = bind(this.Quadrilaterals, this);
      var height, width;
      width = Math.abs(leftBound - rightBound);
      height = Math.abs(topBound - bottomBound);
      this.vertexOnePosition = new THREE.Vector3((Math.random() * width * 0.5) - width * 0.25, height * 0.5, -10);
      this.vertexTwoPosition = new THREE.Vector3(width * -0.5, (Math.random() * height * 0.5) - height * 0.25, -10);
      this.vertexThreePosition = new THREE.Vector3((Math.random() * width * 0.5) - width * 0.25, height * -0.5, -10);
      this.vertexFourPosition = new THREE.Vector3(width * 0.5, (Math.random() * height * 0.5) - height * 0.25, -10);
      this.vertexOneVelocity = new THREE.Vector3((Math.random() * 2) - 1, (Math.random() * 1) - 1, 0);
      this.vertexTwoVelocity = new THREE.Vector3((Math.random() * 1) + 1, (Math.random() * 2) - 1, 0);
      this.vertexThreeVelocity = new THREE.Vector3((Math.random() * 2) - 1, (Math.random() * 1) + 1, 0);
      this.vertexFourVelocity = new THREE.Vector3((Math.random() * 1) - 1, (Math.random() * 2) - 1, 0);
      this.leftBound = leftBound;
      this.rightBound = rightBound;
      this.topBound = topBound;
      this.bottomBound = bottomBound;
      this.quadrilaterals = this.Quadrilaterals(6);
      this.nextCollisionXVelocity = (function() {
        var j, results;
        results = [];
        for (j = 0; j <= 3; j++) {
          results.push(0);
        }
        return results;
      })();
      this.nextCollisionYVelocity = (function() {
        var j, results;
        results = [];
        for (j = 0; j <= 3; j++) {
          results.push(0);
        }
        return results;
      })();
      this.timer = 0;
      this.colorChangeTime = this.RandomColorChangeTime();
      this.ChangeColors();
      return;
    }

    MystifyQuadrilateral.prototype.Quadrilaterals = function(num) {
      var i, j, quadrilateral, quadrilaterals, ref, vertexFour, vertexFourDirection, vertexOne, vertexOneDirection, vertexThree, vertexThreeDirection, vertexTwo, vertexTwoDirection;
      quadrilaterals = [];
      vertexOneDirection = this.vertexOneVelocity.clone().normalize();
      vertexTwoDirection = this.vertexTwoVelocity.clone().normalize();
      vertexThreeDirection = this.vertexThreeVelocity.clone().normalize();
      vertexFourDirection = this.vertexFourVelocity.clone().normalize();
      for (i = j = 0, ref = num - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
        vertexOne = this.vertexOnePosition.clone().add(vertexOneDirection.clone().multiplyScalar(i * 20));
        vertexTwo = this.vertexTwoPosition.clone().add(vertexTwoDirection.clone().multiplyScalar(i * 20));
        vertexThree = this.vertexThreePosition.clone().add(vertexThreeDirection.clone().multiplyScalar(i * 20));
        vertexFour = this.vertexFourPosition.clone().add(vertexFourDirection.clone().multiplyScalar(i * 20));
        quadrilateral = new Quadrilateral(this, vertexOne, vertexTwo, vertexThree, vertexFour, this.vertexOneVelocity.clone(), this.vertexTwoVelocity.clone(), this.vertexThreeVelocity.clone(), this.vertexFourVelocity.clone(), this.leftBound, this.rightBound, this.topBound, this.bottomBound);
        quadrilaterals.push(quadrilateral);
      }
      return quadrilaterals;
    };

    MystifyQuadrilateral.prototype.Update = function(deltaTime) {
      var i, j, k, len, len1, quadrilateral, ref, ref1;
      this.timer += deltaTime;
      if (this.timer > this.colorChangeTime) {
        this.timer = 0;
        this.colorChangeTime = this.RandomColorChangeTime();
        this.ChangeColors();
        ref = this.quadrilaterals;
        for (i = j = 0, len = ref.length; j < len; i = ++j) {
          quadrilateral = ref[i];
          this.SetColorChangeTimeout(quadrilateral, i, newColor);
        }
      }
      ref1 = this.quadrilaterals;
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        quadrilateral = ref1[k];
        quadrilateral.Update(deltaTime);
      }
    };

    MystifyQuadrilateral.prototype.RandomColorChangeTime = function() {
      return Math.random() * 30;
    };

    MystifyQuadrilateral.prototype.SetColorChangeTimeout = function(quadrilateral, i, newColor) {
      setTimeout(function() {
        return quadrilateral.ChangeColor(newColor);
      }, i * 100);
    };

    MystifyQuadrilateral.prototype.ChangeColors = function() {
      var i, j, len, newColor, quadrilateral, ref, results;
      newColor = Math.random() * 0xffffff;
      ref = this.quadrilaterals;
      results = [];
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        quadrilateral = ref[i];
        results.push(this.SetColorChangeTimeout(quadrilateral, i, newColor));
      }
      return results;
    };

    MystifyQuadrilateral.prototype.IsLastVertexToCollide = function(currentQuadrilateral, vertexIndex) {
      var iteratedQuadrilateral, j, len, ref;
      ref = this.quadrilaterals;
      for (j = 0, len = ref.length; j < len; j++) {
        iteratedQuadrilateral = ref[j];
        if (currentQuadrilateral !== iteratedQuadrilateral) {
          if (iteratedQuadrilateral.VelocityByIndex(vertexIndex).length() !== 0) {
            return false;
          }
        }
      }
      return true;
    };

    MystifyQuadrilateral.prototype.FireQuadrilateralsInXDirection = function(vertexIndex, newXVelocity) {
      var i, j, quadrilateral, ref;
      ref = this.quadrilaterals.slice(0);
      for (i = j = ref.length - 1; j >= 0; i = j += -1) {
        quadrilateral = ref[i];
        this.SetQuadrilateralFireInXDirectionTimeout(quadrilateral, i, vertexIndex, newXVelocity);
      }
    };

    MystifyQuadrilateral.prototype.FireQuadrilateralsInYDirection = function(vertexIndex, newYVelocity) {
      var i, j, quadrilateral, ref;
      ref = this.quadrilaterals.slice(0);
      for (i = j = ref.length - 1; j >= 0; i = j += -1) {
        quadrilateral = ref[i];
        this.SetQuadrilateralFireInYDirectionTimeout(quadrilateral, i, vertexIndex, newYVelocity);
      }
    };

    MystifyQuadrilateral.prototype.SetQuadrilateralFireInXDirectionTimeout = function(quadrilateral, quadIndex, vertexIndex, newXVelocity) {
      setTimeout(function() {
        return quadrilateral.SetXVelocityOfVertex(vertexIndex, newXVelocity);
      }, quadIndex * 100);
    };

    MystifyQuadrilateral.prototype.SetQuadrilateralFireInYDirectionTimeout = function(quadrilateral, quadIndex, vertexIndex, newYVelocity) {
      setTimeout(function() {
        return quadrilateral.SetYVelocityOfVertex(vertexIndex, newYVelocity);
      }, quadIndex * 100);
    };

    return MystifyQuadrilateral;

  })();

}).call(this);
