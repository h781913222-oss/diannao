// @ts-nocheck
'use client'

import React, { useRef, useEffect, useCallback } from 'react'

const PARTICLE_COUNT = 2000
const PARTICLE_COLOR = [0.0, 1.0, 1.0] // Cyan - matching Figma

const VERTEX_SHADER = `
attribute vec3 a_position;
attribute float a_size;
attribute float a_speed;
uniform mat4 u_modelViewMatrix;
uniform mat4 u_projectionMatrix;
uniform float u_time;
varying float v_depth;
varying float v_alpha;
void main() {
  vec3 pos = a_position;
  
  // Depth-based rotation (near=fast, far=slow)
  float depth = -pos.z;
  float rotSpeed = a_speed * 0.04;
  
  // Gentle Y-axis rotation only
  float angle = u_time * rotSpeed;
  float cosA = cos(angle);
  float sinA = sin(angle);
  vec3 rotated = vec3(
    pos.x * cosA - pos.z * sinA,
    pos.y,
    pos.x * sinA + pos.z * cosA
  );
  
  vec4 mvPosition = u_modelViewMatrix * vec4(rotated, 1.0);
  gl_Position = u_projectionMatrix * mvPosition;
  
  // Size based on depth
  float finalDepth = -mvPosition.z;
  gl_PointSize = a_size * (4.0 / finalDepth);
  
  v_depth = finalDepth;
  // Gentle twinkle
  v_alpha = 0.7 + 0.3 * sin(u_time * 1.0 + a_position.x * 2.0 + a_position.y * 1.5);
}
`

const FRAGMENT_SHADER = `
precision highp float;
uniform vec3 u_color;
varying float v_depth;
varying float v_alpha;
void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;
  float alpha = smoothstep(0.5, 0.0, dist) * v_alpha;
  float fade = clamp(1.8 - (v_depth - 3.0) / 20.0, 0.15, 1.0);
  gl_FragColor = vec4(u_color, alpha * fade);
}
`

// Meteor shader
const METEOR_VERTEX_SHADER = `
attribute vec3 a_position;
attribute float a_size;
attribute float a_life;
uniform mat4 u_modelViewMatrix;
uniform mat4 u_projectionMatrix;
varying float v_life;
void main() {
  vec4 mvPosition = u_modelViewMatrix * vec4(a_position, 1.0);
  gl_Position = u_projectionMatrix * mvPosition;
  gl_PointSize = a_size * (2.0 / -mvPosition.z) * a_life;
  v_life = a_life;
}
`

const METEOR_FRAGMENT_SHADER = `
precision highp float;
uniform vec3 u_color;
varying float v_life;
void main() {
  float dist = length(gl_PointCoord - vec2(0.5));
  if (dist > 0.5) discard;
  float alpha = smoothstep(0.5, 0.0, dist) * v_life;
  gl_FragColor = vec4(u_color, alpha);
}
`

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  return shader
}

function createProgram(gl: WebGLRenderingContext, vs: string, fs: string) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vs)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fs)
  if (!vertexShader || !fragmentShader) return null
  const program = gl.createProgram()
  if (!program) return null
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  gl.useProgram(program)
  return program
}

function perspective(fov: number, aspect: number, near: number, far: number) {
  const f = 1.0 / Math.tan(fov / 2)
  const nf = 1 / (near - far)
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ])
}

function translate(x: number, y: number, z: number) {
  return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1])
}

function rotateY(angle: number) {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1])
}

function rotateX(angle: number) {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1])
}

function multiply4x4(a: Float32Array, b: Float32Array) {
  const out = new Float32Array(16)
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      out[i * 4 + j] =
        a[i * 4 + 0] * b[0 * 4 + j] +
        a[i * 4 + 1] * b[1 * 4 + j] +
        a[i * 4 + 2] * b[2 * 4 + j] +
        a[i * 4 + 3] * b[3 * 4 + j]
    }
  }
  return out
}

// Meteor type
interface Meteor {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  life: number
  maxLife: number
  size: number
}

// Export createMeteor for parent component
let globalCreateMeteor: ((x: number, y: number) => void) | null = null

export const triggerMeteor = (clientX: number, clientY: number) => {
  if (globalCreateMeteor) {
    globalCreateMeteor(clientX, clientY)
  }
}

export const ParticleScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rotationRef = useRef(0)
  const timeRef = useRef(0)
  const meteorsRef = useRef<Meteor[]>([])
  const rafRef = useRef<number>(0)
  const mouseRef = useRef({ x: 0, y: 0 })
  const targetMouseRef = useRef({ x: 0, y: 0 })

  // Create meteor on click - receives screen coordinates
  const createMeteor = useCallback((clientX: number, clientY: number) => {
    // Convert screen coordinates to world coordinates
    const x = (clientX / window.innerWidth - 0.5) * 24
    const y = -(clientY / window.innerHeight - 0.5) * 18
    
    // Create burst of meteors
    for (let i = 0; i < 15; i++) {
      const angle = (Math.PI * 2 * i) / 15 + Math.random() * 0.3
      const speed = 0.04 + Math.random() * 0.04
      meteorsRef.current.push({
        x: x,
        y: y,
        z: -3 - Math.random() * 3,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        vz: -0.03 - Math.random() * 0.03,
        life: 1,
        maxLife: 1,
        size: 35 + Math.random() * 35,
      })
    }
  }, [])

  // Set global reference
  useEffect(() => {
    globalCreateMeteor = createMeteor
    return () => { globalCreateMeteor = null }
  }, [createMeteor])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl = canvas.getContext('webgl', { alpha: true, antialias: true })!
    if (!gl) return

    // Enable blending for additive effect
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE)

    // Main particle program
    const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER)
    if (!program) return

    // Meteor program
    const meteorProgram = createProgram(gl, METEOR_VERTEX_SHADER, METEOR_FRAGMENT_SHADER)

    // Create starfield particles - uniform distribution
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const sizes = new Float32Array(PARTICLE_COUNT)
    const speeds = new Float32Array(PARTICLE_COUNT)
    
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Uniform distribution with emphasis on edges
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      // Layer-based sizing - bigger particles
      let radius: number
      let baseSize: number
      const layer = Math.random()
      
      if (layer < 0.2) {
        // 20% close particles
        radius = 5 + Math.random() * 6
        baseSize = 16 + Math.random() * 16
      } else if (layer < 0.5) {
        // 30% mid particles
        radius = 9 + Math.random() * 8
        baseSize = 10 + Math.random() * 10
      } else {
        // 50% far particles - more visible
        radius = 15 + Math.random() * 18
        baseSize = 5 + Math.random() * 8
      }
      
      // Spread wider to cover edges
      const spread = 1.2
      const x = radius * Math.sin(phi) * Math.cos(theta) * spread
      const y = radius * Math.sin(phi) * Math.sin(theta) * spread
      const z = -radius * Math.cos(phi) - 6
      
      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z
      
      sizes[i] = baseSize
      speeds[i] = 1.5 - (radius / 35) * 1.2
    }

    // Position buffer
    const posBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW)

    // Size buffer
    const sizeBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.STATIC_DRAW)

    // Speed buffer
    const speedBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, speedBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, speeds, gl.STATIC_DRAW)

    // Meteor buffers
    let meteorPosBuffer = gl.createBuffer()
    let meteorSizeBuffer = gl.createBuffer()
    let meteorLifeBuffer = gl.createBuffer()

    // Main particle uniforms
    const uModelViewMatrix = gl.getUniformLocation(program, 'u_modelViewMatrix')
    const uProjectionMatrix = gl.getUniformLocation(program, 'u_projectionMatrix')
    const uColor = gl.getUniformLocation(program, 'u_color')
    const uTime = gl.getUniformLocation(program, 'u_time')

    // Meteor uniforms
    const mModelViewMatrix = meteorProgram ? gl.getUniformLocation(meteorProgram, 'u_modelViewMatrix') : null
    const mProjectionMatrix = meteorProgram ? gl.getUniformLocation(meteorProgram, 'u_projectionMatrix') : null
    const mColor = meteorProgram ? gl.getUniformLocation(meteorProgram, 'u_color') : null

    // Set color
    gl.useProgram(program)
    gl.uniform3f(uColor, PARTICLE_COLOR[0], PARTICLE_COLOR[1], PARTICLE_COLOR[2])

    // Projection matrix
    let projectionMatrix = perspective(
      (75 * Math.PI) / 180,
      canvas.width / canvas.height,
      0.1,
      1000
    )

    // Resize
    function syncSize() {
      if (!canvas || !gl) return
      const w = canvas.clientWidth || window.innerWidth
      const h = canvas.clientHeight || window.innerHeight
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
        projectionMatrix = perspective((75 * Math.PI) / 180, w / h, 0.1, 1000)
      }
    }

    const ro = new ResizeObserver(syncSize)
    ro.observe(canvas)
    syncSize()

    // Mouse move handler for parallax
    const handleMouseMove = (event: MouseEvent) => {
      targetMouseRef.current.x = (event.clientX / window.innerWidth - 0.5) * 0.5
      targetMouseRef.current.y = -(event.clientY / window.innerHeight - 0.5) * 0.5
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Render loop
    function render() {
      syncSize()
      timeRef.current += 0.016
      
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      // Very gentle mouse parallax - clamped to prevent particles leaving
      const targetX = Math.max(-0.3, Math.min(0.3, targetMouseRef.current.x))
      const targetY = Math.max(-0.3, Math.min(0.3, targetMouseRef.current.y))
      mouseRef.current.x += (targetX - mouseRef.current.x) * 0.01
      mouseRef.current.y += (targetY - mouseRef.current.y) * 0.01

      // Very slow rotation
      rotationRef.current += 0.00003

      // View matrix with gentle parallax (clamped)
      const viewMatrix = multiply4x4(
        rotateY(rotationRef.current),
        translate(mouseRef.current.x * 0.5, mouseRef.current.y * 0.5, -8)
      )

      // Draw main particles
      gl.useProgram(program)
      gl.uniformMatrix4fv(uProjectionMatrix, false, projectionMatrix)
      gl.uniformMatrix4fv(uModelViewMatrix, false, viewMatrix)
      gl.uniform1f(uTime, timeRef.current)

      // Bind position
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer)
      const aPosition = gl.getAttribLocation(program, 'a_position')
      gl.enableVertexAttribArray(aPosition)
      gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0)

      // Bind size
      gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer)
      const aSize = gl.getAttribLocation(program, 'a_size')
      gl.enableVertexAttribArray(aSize)
      gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, 0, 0)

      // Bind speed
      gl.bindBuffer(gl.ARRAY_BUFFER, speedBuffer)
      const aSpeed = gl.getAttribLocation(program, 'a_speed')
      gl.enableVertexAttribArray(aSpeed)
      gl.vertexAttribPointer(aSpeed, 1, gl.FLOAT, false, 0, 0)

      gl.drawArrays(gl.POINTS, 0, PARTICLE_COUNT)

      // Draw meteors
      if (meteorProgram && meteorsRef.current.length > 0) {
        // Update meteors
        const aliveMeteors: Meteor[] = []
        for (const meteor of meteorsRef.current) {
          meteor.x += meteor.vx
          meteor.y += meteor.vy
          meteor.z += meteor.vz
          meteor.life -= 0.015
          if (meteor.life > 0) {
            aliveMeteors.push(meteor)
          }
        }
        meteorsRef.current = aliveMeteors

        if (aliveMeteors.length > 0) {
          const mPositions = new Float32Array(aliveMeteors.length * 3)
          const mSizes = new Float32Array(aliveMeteors.length)
          const mLives = new Float32Array(aliveMeteors.length)

          for (let i = 0; i < aliveMeteors.length; i++) {
            mPositions[i * 3] = aliveMeteors[i].x
            mPositions[i * 3 + 1] = aliveMeteors[i].y
            mPositions[i * 3 + 2] = aliveMeteors[i].z
            mSizes[i] = aliveMeteors[i].size
            mLives[i] = aliveMeteors[i].life
          }

          gl.useProgram(meteorProgram)
          gl.uniformMatrix4fv(mProjectionMatrix, false, projectionMatrix)
          gl.uniformMatrix4fv(mModelViewMatrix, false, viewMatrix)
          gl.uniform3f(mColor, 0.5, 1.0, 1.0)

          // Bind meteor position
          gl.bindBuffer(gl.ARRAY_BUFFER, meteorPosBuffer)
          gl.bufferData(gl.ARRAY_BUFFER, mPositions, gl.DYNAMIC_DRAW)
          const mPos = gl.getAttribLocation(meteorProgram, 'a_position')
          gl.enableVertexAttribArray(mPos)
          gl.vertexAttribPointer(mPos, 3, gl.FLOAT, false, 0, 0)

          // Bind meteor size
          gl.bindBuffer(gl.ARRAY_BUFFER, meteorSizeBuffer)
          gl.bufferData(gl.ARRAY_BUFFER, mSizes, gl.DYNAMIC_DRAW)
          const mSize = gl.getAttribLocation(meteorProgram, 'a_size')
          gl.enableVertexAttribArray(mSize)
          gl.vertexAttribPointer(mSize, 1, gl.FLOAT, false, 0, 0)

          // Bind meteor life
          gl.bindBuffer(gl.ARRAY_BUFFER, meteorLifeBuffer)
          gl.bufferData(gl.ARRAY_BUFFER, mLives, gl.DYNAMIC_DRAW)
          const mLife = gl.getAttribLocation(meteorProgram, 'a_life')
          gl.enableVertexAttribArray(mLife)
          gl.vertexAttribPointer(mLife, 1, gl.FLOAT, false, 0, 0)

          gl.drawArrays(gl.POINTS, 0, aliveMeteors.length)
        }
      }

      rafRef.current = requestAnimationFrame(render)
    }

    rafRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', handleMouseMove)
      ro.disconnect()
      gl.deleteProgram(program)
      if (meteorProgram) gl.deleteProgram(meteorProgram)
      gl.deleteBuffer(posBuffer)
      gl.deleteBuffer(sizeBuffer)
      gl.deleteBuffer(speedBuffer)
      gl.deleteBuffer(meteorPosBuffer)
      gl.deleteBuffer(meteorSizeBuffer)
      gl.deleteBuffer(meteorLifeBuffer)
    }
  }, [createMeteor])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block', zIndex: 1, mixBlendMode: 'screen' }}
    />
  )
}

export default ParticleScene
