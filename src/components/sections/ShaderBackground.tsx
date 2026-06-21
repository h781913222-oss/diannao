// @ts-nocheck
'use client'

import React, { useRef, useEffect } from 'react'

const VERTEX_SHADER = `
attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`

const FRAGMENT_SHADER = `
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
varying vec2 v_texCoord;

void main() {
    vec2 uv = v_texCoord;
    vec2 mouse = u_mouse / u_resolution;
    
    float t = u_time * 0.2;
    
    // Aurora colors - matching Figma
    vec3 color1 = vec3(0.05, 0.1, 0.2); // Deep blue
    vec3 color2 = vec3(0.4, 0.0, 0.8); // Electric purple
    vec3 color3 = vec3(0.0, 0.8, 0.8); // Cyan
    
    float n1 = sin(uv.x * 2.0 + t) * sin(uv.y * 3.0 - t);
    float n2 = cos(uv.y * 2.0 + t * 0.5) * sin(uv.x * 4.0 + t);
    
    vec3 color = mix(color1, color2, n1 * 0.5 + 0.5);
    color = mix(color, color3, n2 * 0.3);
    
    // Mouse-follow spotlight
    float dist = distance(uv, mouse);
    float spotlight = smoothstep(0.4, 0.0, dist);
    color += spotlight * 0.15;
    
    // Darken edges
    float vignette = 1.0 - smoothstep(0.5, 1.5, length(uv - 0.5));
    color *= vignette;
    
    // Deep black base - matching Figma
    color = mix(vec3(0.01, 0.01, 0.02), color, 0.6);
    
    gl_FragColor = vec4(color, 1.0);
}
`

export const ShaderBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const gl =
      canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    if (!gl) return

    const glCtx = gl as WebGLRenderingContext

    // Compile shaders
    function compileShader(type: number, src: string) {
      const s = glCtx.createShader(type)
      if (!s) return null
      glCtx.shaderSource(s, src)
      glCtx.compileShader(s)
      return s
    }

    const vs = compileShader(glCtx.VERTEX_SHADER, VERTEX_SHADER)
    const fs = compileShader(glCtx.FRAGMENT_SHADER, FRAGMENT_SHADER)
    if (!vs || !fs) return

    const prog = glCtx.createProgram()
    if (!prog) return
    glCtx.attachShader(prog, vs)
    glCtx.attachShader(prog, fs)
    glCtx.linkProgram(prog)
    glCtx.useProgram(prog)

    // Buffer
    const buf = glCtx.createBuffer()
    glCtx.bindBuffer(glCtx.ARRAY_BUFFER, buf)
    glCtx.bufferData(
      glCtx.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      glCtx.STATIC_DRAW
    )
    const pos = glCtx.getAttribLocation(prog, 'a_position')
    glCtx.enableVertexAttribArray(pos)
    glCtx.vertexAttribPointer(pos, 2, glCtx.FLOAT, false, 0, 0)

    // Uniforms
    const uTime = glCtx.getUniformLocation(prog, 'u_time')
    const uRes = glCtx.getUniformLocation(prog, 'u_resolution')
    const uMouse = glCtx.getUniformLocation(prog, 'u_mouse')

    // Resize
    function syncSize() {
      if (!canvas) return
      const w = canvas!.clientWidth || 1280
      const h = canvas!.clientHeight || 720
      if (canvas!.width !== w || canvas!.height !== h) {
        canvas!.width = w
        canvas!.height = h
        glCtx.viewport(0, 0, w, h)
      }
    }

    const ro = new ResizeObserver(syncSize)
    ro.observe(canvas)
    syncSize()

    // Mouse
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      if (rect.width && rect.height) {
        const nx = (event.clientX - rect.left) / rect.width
        const ny = 1.0 - (event.clientY - rect.top) / rect.height
        mouseRef.current.x = nx * canvas.width
        mouseRef.current.y = ny * canvas.height
      }
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Render
    function render(t: number) {
      syncSize()
      if (uTime) glCtx.uniform1f(uTime, t * 0.001)
      if (uRes) glCtx.uniform2f(uRes, canvas.width, canvas.height)
      if (uMouse)
        glCtx.uniform2f(uMouse, mouseRef.current.x, mouseRef.current.y)
      glCtx.drawArrays(glCtx.TRIANGLE_STRIP, 0, 4)
      rafRef.current = requestAnimationFrame(render)
    }
    rafRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', handleMouseMove)
      ro.disconnect()
      glCtx.deleteProgram(prog)
      glCtx.deleteShader(vs)
      glCtx.deleteShader(fs)
      glCtx.deleteBuffer(buf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: 'block', zIndex: 0 }}
    />
  )
}

export default ShaderBackground
