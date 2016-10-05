module.exports = class Visualizer
  constructor: (audioInitializer, bloomParams, noiseAmount, blendStrength, beatDistortionEffect) ->
    @audioInitializer = audioInitializer
    @timer = 0
    @scene = new THREE.Scene

    @bloomParams = bloomParams
    @noiseAmount = noiseAmount
    @blendStrength = blendStrength
    @beatDistortionEffect = beatDistortionEffect
    @no_glow = false
    @clearColor = 0x000000
    @clearOpacity = 0

    @showChannelNum = true
    @showCornerLogo = true

    return

  Update: (deltaTime) ->
    return

  Render: ->
    return

  HandleKeyDownInput: (keyCode) ->
    return

  HandleKeyUpInput: (keyCode) ->
    return

  Activate: ->
    return

  RandomFloat: (min, max) ->
    return Math.random() * (max - min) + min

  RandomInt: (min, max) ->
    return Math.floor(Math.random() * (max - min + 1)) + min
