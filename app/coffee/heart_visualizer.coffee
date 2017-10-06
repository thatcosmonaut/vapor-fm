Visualizer = require('coffee/visualizer')

module.exports = class HeartVisualizer extends Visualizer
  constructor: (audioInitializer) ->
    super(audioInitializer,
          { strength: 1, strengthIncrease: 0.5, kernelSize: 12, sigma: 1.5, resolution: 512 },
          0.0,
          2.0,
          false)

    @camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    @ambientLight = new THREE.AmbientLight(0x404040)
    @scene.add(@ambientLight)

    @pointLight = new THREE.PointLight(0xffffff, 1, 100)
    @pointLight.position.set(10, 20, 20)
    @scene.add(@pointLight)

    @skyBox = @SkyBox()
    @scene.add(@skyBox)

    @Hearts(40)

    @camera.position.z = 20

    return

  Heart: ->
    heartMaterial = new THREE.MeshPhongMaterial({color: 0xff0000})
    loader = new THREE.OBJLoader
    loader.load 'models/heart.obj', (object) =>
      object.traverse (child) ->
        if (child instanceof THREE.Mesh)
          child.material = heartMaterial

      @heart = object
      @scene.add(object)
    return

  Hearts: (number) ->
    @hearts = []
    heartMaterial = new THREE.MeshPhongMaterial({color: 0xFF9100})
    loader = new THREE.OBJLoader
    loader.load 'models/GoodJack.obj', (object) =>
      object.traverse (child) ->
        if (child instanceof THREE.Mesh)
          child.material = heartMaterial

      object.userData = { extraRotation: 0 }
      object.rotation.set(@RandomFloat(0, Math.PI/4), @RandomFloat(0, Math.PI/4), 0)
      object.scale.set(1, 1, 1)

      for i in [0..number]
        newObject = object.clone()
        @hearts.push(newObject)
        @scene.add(newObject)

      @SetHeartsPositions()
    return

  Jack: ->
    heartMaterial = new THREE.MeshPhongMaterial({color: 0xff0000})
    loader = new THREE.OBJLoader
    loader.load 'models/GoodJack.obj', (object) =>
      object.traverse (child) ->
        if (child instanceof THREE.Mesh)
          child.material = heartMaterial

      @heart = object
      @scene.add(object)
    return

  SetHeartsPositions: ->
    positions = []
    for heart in @hearts
      newPosition = new THREE.Vector3(@RandomInt(-40, 40), @RandomInt(-40, 40), @RandomInt(-40, 40))
      overlapping = undefined
      if positions.length == 0 then overlapping = false else overlapping = true

      while overlapping
        newPosition = new THREE.Vector3(@RandomInt(-40, 40), @RandomInt(-40, 40), @RandomInt(-40, 40))
        overlapping = false
        for position in positions
          if newPosition.distanceTo(position) < 8
            overlapping = true

      positions.push(newPosition)
      heart.position.set(newPosition.x, newPosition.y, newPosition.z)

    return

  SkyBox: ->
    geometry = new THREE.BoxGeometry(500, 500, 500)
    material = new THREE.MeshBasicMaterial({color: 0x1f0e19, side: THREE.BackSide})
    skybox = new THREE.Mesh(geometry, material)
    skybox

  Update: (deltaTime) =>
    @timer += 0.01

    @heart.rotation.y = @timer if @heart?

    if @hearts?
      for heartObject in @hearts
        if heartObject?
          heartObject.rotation.y += 0.01 + heartObject.userData.extraRotation
          heartObject.rotation.x += heartObject.userData.extraRotation
          heartObject.userData.extraRotation = Math.max(0, heartObject.userData.extraRotation - 0.01)
          heartObject.scale.x = Math.max(heartObject.scale.x - 0.001, 1)
          heartObject.scale.y = Math.max(heartObject.scale.y - 0.001, 1)
          heartObject.scale.z = Math.max(heartObject.scale.z - 0.001, 1)

      if @audioInitializer.beatdetect.isKick()
        randomHeart = @hearts[@RandomInt(0, @hearts.length)]
        randomHeart.userData.extraRotation = 0.4 if randomHeart?

      if @audioInitializer.beatdetect.isSnare()
        for heartObject in @hearts
          if heartObject?
            heartObject.scale.set(1.1, 1.1, 1.1) if Math.random() < 0.33

    @camera.position.set(40 * Math.cos(@timer * 0.5), 0, 40 * Math.sin(@timer * 0.5))
    @camera.lookAt(@scene.position)

    return
