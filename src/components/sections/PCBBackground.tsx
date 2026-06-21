// @ts-nocheck
'use client'

import React, { useEffect, useRef } from 'react'

// ─── Types ───────────────────────────────────────
interface Node {
  x: number
  y: number
  label: string
  size: number
  glow: number
  lit: boolean
}

interface Segment {
  x1: number
  y1: number
  x2: number
  y2: number
  len: number
}

interface Path {
  segments: Segment[]
  totalLen: number
  progress: number
  speed: number
  baseSpeed: number
  color: string
  active: boolean
}

interface TrailPoint {
  x: number
  y: number
  opacity: number
  size: number
}

// ─── Smoothstep: 0→1, 1→0, 2nd-order continuity ───
const smoothstep = (min: number, max: number, val: number) => {
  const x = Math.max(0, Math.min(1, (val - min) / (max - min)))
  return x * x * (3 - 2 * x)
}

// ─── Distance from point to segment (approximate via midpoint) ───
const segDistToPoint = (seg: Segment, px: number, py: number) => {
  const mx = (seg.x1 + seg.x2) / 2
  const my = (seg.y1 + seg.y2) / 2
  return Math.sqrt((mx - px) ** 2 + (my - py) ** 2)
}

export const PCBBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000, active: false })

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = container.offsetWidth
    let height = container.offsetHeight
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      width = container.offsetWidth
      height = container.offsetHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = width + 'px'
      canvas.style.height = height + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    const cx = width / 2
    const cy = height / 2
    const s = Math.min(width, height) / 650

    // ─── Generate noise texture ───
    const noiseCanvas = document.createElement('canvas')
    noiseCanvas.width = 200
    noiseCanvas.height = 200
    const nCtx = noiseCanvas.getContext('2d')
    if (nCtx) {
      for (let i = 0; i < 6000; i++) {
        const x = Math.random() * 200
        const y = Math.random() * 200
        const a = Math.random() * 0.035
        nCtx.fillStyle = `rgba(255,255,255,${a})`
        nCtx.fillRect(x, y, 1.5, 1.5)
      }
    }

    // ─── Nodes ───
    const nodes: Node[] = [
      { x: cx, y: cy, label: 'CPU', size: 9, glow: 0, lit: false },
      { x: cx + 200 * s, y: cy - 180 * s, label: 'GPU', size: 7, glow: 0, lit: false },
      { x: cx - 140 * s, y: cy - 160 * s, label: 'RAM', size: 7, glow: 0, lit: false },
      { x: cx - 250 * s, y: cy - 60 * s, label: 'SSD', size: 6, glow: 0, lit: false },
      { x: cx - 220 * s, y: cy + 140 * s, label: 'FAN', size: 5, glow: 0, lit: false },
      { x: cx + 260 * s, y: cy + 100 * s, label: 'IO', size: 6, glow: 0, lit: false },
      { x: cx + 300 * s, y: cy - 100 * s, label: 'USB', size: 5, glow: 0, lit: false },
      { x: cx - 90 * s, y: cy + 220 * s, label: 'PWR', size: 5, glow: 0, lit: false },
      { x: cx + 140 * s, y: cy + 200 * s, label: 'ETH', size: 5, glow: 0, lit: false },
      { x: cx - 320 * s, y: cy - 200 * s, label: 'C1', size: 4, glow: 0, lit: false },
      { x: cx + 320 * s, y: cy + 160 * s, label: 'C2', size: 4, glow: 0, lit: false },
      { x: cx - 170 * s, y: cy - 300 * s, label: 'R1', size: 4, glow: 0, lit: false },
      { x: cx + 190 * s, y: cy + 300 * s, label: 'R2', size: 4, glow: 0, lit: false },
      { x: cx + 360 * s, y: cy - 30 * s, label: 'PCI', size: 6, glow: 0, lit: false },
      { x: cx - 340 * s, y: cy + 60 * s, label: 'SATA', size: 5, glow: 0, lit: false },
      { x: cx + 90 * s, y: cy - 340 * s, label: 'CLK', size: 4, glow: 0, lit: false },
      { x: cx - 110 * s, y: cy + 360 * s, label: 'GND', size: 4, glow: 0, lit: false },
    ]

    const connections = [
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7], [0, 8],
      [1, 6], [2, 3], [2, 11], [3, 9], [4, 9], [4, 7], [5, 8], [5, 10],
      [6, 13], [7, 8], [7, 12], [8, 12], [9, 11], [10, 13], [11, 12],
      [1, 13], [3, 14], [5, 14], [0, 14], [9, 14], [1, 15], [2, 15], [7, 16], [8, 16],
    ]

    const paths: Path[] = []
    const trails: TrailPoint[][] = []

    const createPath = (a: Node, b: Node): Path => {
      const hf = Math.random() > 0.5
      const mx = hf ? b.x : a.x
      const my = hf ? a.y : b.y
      const s1: Segment = { x1: a.x, y1: a.y, x2: mx, y2: my, len: 0 }
      const s2: Segment = { x1: mx, y1: my, x2: b.x, y2: b.y, len: 0 }
      s1.len = Math.abs(s1.x2 - s1.x1) + Math.abs(s1.y2 - s1.y1)
      s2.len = Math.abs(s2.x2 - s2.x1) + Math.abs(s2.y2 - s2.y1)
      const totalLen = s1.len + s2.len
      const baseSpeed = 0.0001 + Math.random() * 0.00015
      // 80% blue, 20% purple — only two colors
      const color = Math.random() > 0.2 ? '#6366f1' : '#a855f7'
      return {
        segments: [s1, s2],
        totalLen,
        progress: Math.random(),
        speed: baseSpeed,
        baseSpeed,
        color,
        active: false,
      }
    }

    connections.forEach(([i, j]) => {
      if (nodes[i] && nodes[j]) {
        paths.push(createPath(nodes[i], nodes[j]))
        trails.push([])
      }
    })

    // ─── Boot phase ───
    const bootMainPaths = [0, 2, 4]
    const bootPhase = 3000
    let startTime = performance.now()
    let bootDone = false

    const lightOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
    let lightIndex = 0
    let lightTimer = 0

    const getPosOnPath = (path: Path, progress: number) => {
      let cur = 0
      const target = progress * path.totalLen
      for (const seg of path.segments) {
        if (cur + seg.len >= target) {
          const t = seg.len > 0 ? (target - cur) / seg.len : 0
          return {
            x: seg.x1 + (seg.x2 - seg.x1) * t,
            y: seg.y1 + (seg.y2 - seg.y1) * t,
          }
        }
        cur += seg.len
      }
      const last = path.segments[path.segments.length - 1]
      return { x: last.x2, y: last.y2 }
    }

    // ─── Draw layered glow (no shadowBlur) ───
    const drawGlow = (x: number, y: number, color: string, size: number, alpha: number) => {
      // layer 1: widest, faintest
      ctx.beginPath()
      ctx.arc(x, y, size * 8, 0, Math.PI * 2)
      const g1 = ctx.createRadialGradient(x, y, 0, x, y, size * 8)
      g1.addColorStop(0, color + '08')
      g1.addColorStop(1, 'transparent')
      ctx.fillStyle = g1
      ctx.fill()

      // layer 2: wide, soft
      ctx.beginPath()
      ctx.arc(x, y, size * 4, 0, Math.PI * 2)
      const g2 = ctx.createRadialGradient(x, y, 0, x, y, size * 4)
      g2.addColorStop(0, color + '14')
      g2.addColorStop(1, 'transparent')
      ctx.fillStyle = g2
      ctx.fill()

      // layer 3: medium
      ctx.beginPath()
      ctx.arc(x, y, size * 2, 0, Math.PI * 2)
      const g3 = ctx.createRadialGradient(x, y, 0, x, y, size * 2)
      g3.addColorStop(0, color + '35')
      g3.addColorStop(1, 'transparent')
      ctx.fillStyle = g3
      ctx.fill()

      // core
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fillStyle = color
      ctx.globalAlpha = alpha
      ctx.fill()
      ctx.globalAlpha = 1
    }

    // ─── Draw node ───
    const drawNode = (node: Node) => {
      node.glow = Math.max(0, node.glow - 0.012)
      const sz = node.size
      const glowR = sz * (2 + node.glow * 5)

      if (node.glow > 0.03) {
        ctx.beginPath()
        ctx.arc(node.x, node.y, glowR, 0, Math.PI * 2)
        const g = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowR)
        g.addColorStop(0, `rgba(255,255,255,${node.glow * 0.15})`)
        g.addColorStop(0.5, `rgba(255,255,255,${node.glow * 0.05})`)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.fill()
      }

      if (sz >= 6) {
        const hw = sz + 2
        ctx.fillStyle = `rgba(255,255,255,${0.04 + node.glow * 0.1})`
        ctx.fillRect(node.x - hw, node.y - hw, hw * 2, hw * 2)
        ctx.strokeStyle = `rgba(255,255,255,${0.05 + node.glow * 0.12})`
        ctx.lineWidth = 1
        ctx.strokeRect(node.x - hw, node.y - hw, hw * 2, hw * 2)
      } else {
        ctx.beginPath()
        ctx.arc(node.x, node.y, sz, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${0.03 + node.glow * 0.1})`
        ctx.fill()
      }

      if (node.lit || node.glow > 0.3) {
        ctx.font = '9px Inter, monospace'
        ctx.fillStyle = `rgba(255,255,255,${0.02 + node.glow * 0.07})`
        ctx.textAlign = 'center'
        ctx.fillText(node.label, node.x, node.y + sz + 14)
      }
    }

    // ─── Vignette ───
    const drawVignette = () => {
      const vg = ctx.createRadialGradient(cx, cy, width * 0.3, cx, cy, width * 0.85)
      vg.addColorStop(0, 'transparent')
      vg.addColorStop(0.55, 'rgba(0,0,0,0.12)')
      vg.addColorStop(1, 'rgba(0,0,0,0.55)')
      ctx.fillStyle = vg
      ctx.fillRect(0, 0, width, height)
    }

    // ─── Draw trail ───
    const drawTrail = (trail: TrailPoint[], color: string) => {
      trail.forEach((p, i) => {
        p.opacity *= 0.92
        p.size *= 0.95
        const ratio = i / Math.max(1, trail.length)
        const a = p.opacity * ratio * 0.5
        if (a < 0.01) return
        const s = p.size * ratio + 0.5
        drawGlow(p.x, p.y, color, s, a * 0.6)
      })
    }

    // ─── Main loop ───
    const animate = (now: number) => {
      const elapsed = now - startTime
      const bootRatio = Math.min(1, elapsed / bootPhase)
      if (bootRatio >= 1) bootDone = true

      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const mouseActive = mouseRef.current.active

      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = '#0a0a0f'
      ctx.fillRect(0, 0, width, height)

      // ── 1. Draw all lines (spotlight reveal) ──
      paths.forEach((path) => {
        path.segments.forEach((seg) => {
          const dist = segDistToPoint(seg, mx, my)
          // spotlight: 0-80px full bright, 80-280px fade, >280px invisible
          const spotlight = mouseActive ? 1 - smoothstep(80, 280, dist) : 0
          const baseAlpha = 0.012 // nearly invisible normally
          const revealAlpha = baseAlpha + spotlight * 0.14
          const lineWidth = 1.2 + spotlight * 0.8

          // glow substrate
          ctx.beginPath()
          ctx.moveTo(seg.x1, seg.y1)
          ctx.lineTo(seg.x2, seg.y2)
          ctx.strokeStyle = `rgba(255,255,255,${revealAlpha * 0.2})`
          ctx.lineWidth = lineWidth + 2
          ctx.lineCap = 'round'
          ctx.stroke()

          // main line
          ctx.beginPath()
          ctx.moveTo(seg.x1, seg.y1)
          ctx.lineTo(seg.x2, seg.y2)
          ctx.strokeStyle = `rgba(255,255,255,${revealAlpha})`
          ctx.lineWidth = lineWidth
          ctx.lineCap = 'round'
          ctx.stroke()
        })

        // speed up near mouse
        if (mouseActive) {
          const minDist = Math.min(
            segDistToPoint(path.segments[0], mx, my),
            segDistToPoint(path.segments[1], mx, my)
          )
          const boost = 1 - smoothstep(60, 250, minDist)
          path.speed = path.baseSpeed * (1 + boost * 0.8)
        } else {
          path.speed = path.baseSpeed
        }
      })

      // ── 2. Boot animation ──
      if (!bootDone) {
        // 3 main paths rush through
        bootMainPaths.forEach((bpi, idx) => {
          const path = paths[bpi]
          if (!path) return
          const progress = Math.min(1, (elapsed - idx * 400) / 1800)
          if (progress <= 0) return

          const pos = getPosOnPath(path, progress)

          trails[bpi].push({ x: pos.x, y: pos.y, opacity: 1, size: 3.5 })
          if (trails[bpi].length > 12) trails[bpi].shift()

          drawTrail(trails[bpi], path.color)
          drawGlow(pos.x, pos.y, path.color, 3.5, 0.9)

          nodes.forEach(n => {
            const d = Math.sqrt((pos.x - n.x) ** 2 + (pos.y - n.y) ** 2)
            if (d < 30) n.glow = Math.min(1, n.glow + 0.3)
          })
        })

        // other paths fade in slowly
        paths.forEach((path, pi) => {
          if (bootMainPaths.includes(pi)) return
          const fadeIn = Math.max(0, (elapsed - 1500) / 2000)
          if (fadeIn <= 0) return
          path.progress += path.speed * 0.5
          if (path.progress >= 1) path.progress = 0
          const pos = getPosOnPath(path, path.progress)
          drawGlow(pos.x, pos.y, path.color, 1.8, fadeIn * 0.6)
        })
      } else {
        // ── 3. Normal mode: 10 active paths ──
        const activeIndices = [0, 1, 2, 3, 5, 7, 8, 11, 13, 15]
        activeIndices.forEach(pi => {
          const path = paths[pi]
          if (!path) return
          path.progress += path.speed
          if (path.progress >= 1) path.progress = 0
          const pos = getPosOnPath(path, path.progress)

          const mouseDist = Math.sqrt((pos.x - mx) ** 2 + (pos.y - my) ** 2)
          const mouseFactor = mouseActive ? 1 - smoothstep(60, 220, mouseDist) : 0
          const pulseSize = 2.5 + mouseFactor * 1.5
          const intensity = 0.6 + mouseFactor * 0.35

          trails[pi].push({ x: pos.x, y: pos.y, opacity: 0.7, size: pulseSize * 0.8 })
          if (trails[pi].length > 10) trails[pi].shift()

          drawTrail(trails[pi], path.color)
          drawGlow(pos.x, pos.y, path.color, pulseSize, intensity)

          nodes.forEach(n => {
            const d = Math.sqrt((pos.x - n.x) ** 2 + (pos.y - n.y) ** 2)
            if (d < 20) n.glow = Math.min(1, n.glow + 0.08)
          })
        })
      }

      // clean inactive trails
      paths.forEach((_, i) => {
        if (bootDone) {
          const active = [0, 1, 2, 3, 5, 7, 8, 11, 13, 15]
          if (!active.includes(i)) trails[i].length = 0
        }
      })

      // sequential node lighting
      if (bootDone) {
        lightTimer += 0.016
        if (lightTimer > 0.15 && lightIndex < lightOrder.length) {
          const ni = lightOrder[lightIndex]
          if (nodes[ni]) nodes[ni].lit = true
          lightIndex++
          lightTimer = 0
        }
      }

      // ── 4. Draw nodes ──
      nodes.forEach(drawNode)

      // ── 5. Noise overlay ──
      ctx.save()
      ctx.globalAlpha = 0.5
      for (let x = 0; x < width; x += 200) {
        for (let y = 0; y < height; y += 200) {
          ctx.drawImage(noiseCanvas, x, y, 200, 200)
        }
      }
      ctx.restore()

      // ── 6. Vignette ──
      drawVignette()

      // ── 7. Mouse spotlight ring ──
      if (mouseActive && mx > 0 && my > 0) {
        const ring = ctx.createRadialGradient(mx, my, 0, mx, my, 280)
        ring.addColorStop(0, 'rgba(255,255,255,0.015)')
        ring.addColorStop(0.3, 'rgba(255,255,255,0.008)')
        ring.addColorStop(0.7, 'rgba(255,255,255,0.002)')
        ring.addColorStop(1, 'transparent')
        ctx.beginPath()
        ctx.arc(mx, my, 280, 0, Math.PI * 2)
        ctx.fillStyle = ring
        ctx.fill()
      }

      requestAnimationFrame(animate)
    }

    const rafId = requestAnimationFrame(animate)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      }
    }
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000, active: false }
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(rafId)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none" style={{ backgroundColor: '#0a0a0f' }}>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-auto" />
    </div>
  )
}

export default PCBBackground
