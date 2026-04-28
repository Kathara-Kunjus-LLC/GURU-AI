import { useRef, useCallback, useMemo, useEffect, useState } from 'react'
import ForceGraph from 'force-graph'
import { domainColor } from '../lib/colors'

const LINK_COLORS = {
  'prereq': 'rgba(129,140,248,0.65)',
  'builds-into': 'rgba(74,222,128,0.65)',
  'related': 'rgba(148,163,184,0.2)',
}

const LINK_DASH = {
  'prereq': [],
  'builds-into': [5, 4],
  'related': [2, 6],
}

function hexPath(ctx, cx, cy, r) {
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i + Math.PI / 6
    const x = cx + r * Math.cos(a)
    const y = cy + r * Math.sin(a)
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
  }
  ctx.closePath()
}

function getNodesWithinDepth(nodes, edges, rootId, depth) {
  if (!rootId || depth === 0) return new Set(nodes.map(n => n.id))
  const adj = new Map()
  nodes.forEach(n => adj.set(n.id, []))
  edges.forEach(e => {
    adj.get(e.source)?.push(e.target)
    adj.get(e.target)?.push(e.source)
  })
  const visited = new Set([rootId])
  let frontier = [rootId]
  for (let i = 0; i < depth; i++) {
    const next = []
    for (const id of frontier) {
      for (const nb of (adj.get(id) || [])) {
        if (!visited.has(nb)) { visited.add(nb); next.push(nb) }
      }
    }
    frontier = next
  }
  return visited
}

export default function Graph({ nodes, edges, filters, selectedId, onSelectNode, searchMatches }) {
  const containerRef = useRef(null)
  const graphRef = useRef(null)
  const [tooltip, setTooltip] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const visibleIds = useMemo(
    () => getNodesWithinDepth(nodes, edges, selectedId, filters.depth),
    [nodes, edges, selectedId, filters.depth]
  )

  const graphData = useMemo(() => {
    const filteredNodes = nodes.filter(n => {
      if (filters.hiddenDomains.has(n.parentDomain)) return false
      if (!visibleIds.has(n.id)) return false
      return true
    })
    const nodeIds = new Set(filteredNodes.map(n => n.id))
    const filteredEdges = edges.filter(e =>
      !filters.hiddenEdgeTypes.has(e.type) &&
      nodeIds.has(e.source) &&
      nodeIds.has(e.target)
    )
    return {
      nodes: filteredNodes.map(n => ({ ...n })),
      links: filteredEdges.map(e => ({ ...e })),
    }
  }, [nodes, edges, filters, visibleIds])

  const degreeMap = useMemo(() => {
    const m = new Map()
    edges.forEach(e => {
      m.set(e.source, (m.get(e.source) || 0) + 1)
      m.set(e.target, (m.get(e.target) || 0) + 1)
    })
    return m
  }, [edges])

  useEffect(() => {
    if (!containerRef.current || graphRef.current) return
    const el = containerRef.current

    graphRef.current = ForceGraph()(el)
      .nodeId('id')
      .backgroundColor('#020617')
      .nodeCanvasObjectMode(() => 'replace')
      .linkCanvasObjectMode(() => 'replace')
      .cooldownTime(3000)
      .d3AlphaDecay(0.035)
      .d3VelocityDecay(0.55)
      .width(el.clientWidth)
      .height(el.clientHeight)

    const linkForce = graphRef.current.d3Force('link')
    if (linkForce) linkForce.distance(90).strength(0.55)
    const chargeForce = graphRef.current.d3Force('charge')
    if (chargeForce) chargeForce.strength(-280)

    const ro = new ResizeObserver(() => {
      graphRef.current?.width(el.clientWidth).height(el.clientHeight)
    })
    ro.observe(el)

    return () => {
      ro.disconnect()
      el.innerHTML = ''
      graphRef.current = null
    }
  }, [])

  const nodeCanvasObject = useCallback((node, ctx, globalScale) => {
    const deg = degreeMap.get(node.id) || 1
    const r = Math.max(4, Math.sqrt(deg) * 3.2)
    const color = domainColor(node.parentDomain)
    const isStaged = node.isStaged === true

    let alpha = 1
    if (filters.bridgeOnly && !node.isBridge) alpha = 0.12
    if (searchMatches && searchMatches.size > 0 && !searchMatches.has(node.id)) alpha = 0.12
    if (selectedId && node.id !== selectedId) alpha = Math.min(alpha, 0.5)

    ctx.globalAlpha = alpha

    if (isStaged) {
      // Staged nodes: outline-only hex with dashed border, no fill
      ctx.save()
      ctx.setLineDash([3, 3])
      hexPath(ctx, node.x, node.y, r)
      ctx.strokeStyle = color + '90'
      ctx.lineWidth = 1.5 / globalScale
      ctx.stroke()
      ctx.restore()
      ctx.setLineDash([])

      // Subtle fill to distinguish from background
      hexPath(ctx, node.x, node.y, r)
      ctx.fillStyle = color + '18'
      ctx.fill()
    } else {
      if (node.isBridge) {
        hexPath(ctx, node.x, node.y, r + 4.5)
        ctx.strokeStyle = color + '30'
        ctx.lineWidth = 1 / globalScale
        ctx.stroke()
        hexPath(ctx, node.x, node.y, r + 2)
        ctx.strokeStyle = color + '60'
        ctx.lineWidth = 1 / globalScale
        ctx.stroke()
      }

      hexPath(ctx, node.x, node.y, r)
      ctx.fillStyle = color
      ctx.fill()

      hexPath(ctx, node.x, node.y, r * 0.55)
      ctx.fillStyle = 'rgba(0,0,0,0.2)'
      ctx.fill()
    }

    if (node.id === selectedId) {
      hexPath(ctx, node.x, node.y, r + 2)
      ctx.strokeStyle = 'rgba(255,255,255,0.9)'
      ctx.lineWidth = 1.5 / globalScale
      ctx.stroke()
    }

    const label = node.title.length > 26 ? node.title.slice(0, 25) + '…' : node.title
    const fontSize = Math.max(7.5, 10.5 / globalScale)
    ctx.font = `500 ${fontSize}px Inter, sans-serif`
    ctx.fillStyle = `rgba(203,213,225,${alpha * (isStaged ? 0.6 : 0.85)})`
    ctx.textAlign = 'center'
    ctx.fillText(label, node.x, node.y + r + fontSize + 2)

    ctx.globalAlpha = 1
  }, [degreeMap, filters.bridgeOnly, searchMatches, selectedId])

  const linkCanvasObject = useCallback((link, ctx) => {
    const start = link.source
    const end = link.target
    if (!start?.x || !end?.x) return

    ctx.save()
    ctx.strokeStyle = LINK_COLORS[link.type] ?? 'rgba(148,163,184,0.25)'
    ctx.lineWidth = link.type === 'related' ? 0.75 : 1
    ctx.setLineDash(LINK_DASH[link.type] ?? [])
    ctx.beginPath()
    ctx.moveTo(start.x, start.y)
    ctx.lineTo(end.x, end.y)
    ctx.stroke()

    if (link.type === 'prereq' || link.type === 'builds-into') {
      const dx = end.x - start.x
      const dy = end.y - start.y
      const len = Math.sqrt(dx * dx + dy * dy)
      if (len < 1) { ctx.restore(); return }
      const ux = dx / len, uy = dy / len
      const targetR = Math.max(4, Math.sqrt(degreeMap.get(typeof end === 'object' ? end.id : end) || 1) * 3.2)
      const tipX = end.x - ux * (targetR + 3)
      const tipY = end.y - uy * (targetR + 3)
      const arrowLen = 5, arrowAngle = 0.42
      ctx.setLineDash([])
      ctx.beginPath()
      ctx.moveTo(tipX, tipY)
      ctx.lineTo(tipX - arrowLen * Math.cos(-arrowAngle + Math.atan2(uy, ux)), tipY - arrowLen * Math.sin(-arrowAngle + Math.atan2(uy, ux)))
      ctx.moveTo(tipX, tipY)
      ctx.lineTo(tipX - arrowLen * Math.cos(arrowAngle + Math.atan2(uy, ux)), tipY - arrowLen * Math.sin(arrowAngle + Math.atan2(uy, ux)))
      ctx.stroke()
    }

    ctx.restore()
    ctx.setLineDash([])
  }, [degreeMap])

  const handleNodeClick = useCallback((node) => {
    onSelectNode(node.id === selectedId ? null : node.id)
  }, [onSelectNode, selectedId])

  const handleNodeHover = useCallback((node) => {
    setTooltip(node || null)
  }, [])

  useEffect(() => {
    if (!graphRef.current) return
    graphRef.current
      .graphData(graphData)
      .nodeCanvasObject(nodeCanvasObject)
      .linkCanvasObject(linkCanvasObject)
      .onNodeClick(handleNodeClick)
      .onNodeHover(handleNodeHover)
      .onBackgroundClick(() => onSelectNode(null))
      .nodePointerAreaPaint((node, color, ctx) => {
        const deg = degreeMap.get(node.id) || 1
        const r = Math.max(4, Math.sqrt(deg) * 3.2) + 5
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(node.x, node.y, r, 0, 2 * Math.PI)
        ctx.fill()
      })
  }, [graphData, nodeCanvasObject, linkCanvasObject, handleNodeClick, handleNodeHover, onSelectNode, degreeMap])

  useEffect(() => {
    if (!selectedId || !graphRef.current) return
    const node = graphData.nodes.find(n => n.id === selectedId)
    if (node?.x != null) {
      graphRef.current.centerAt(node.x, node.y, 600)
    }
  }, [selectedId, graphData])

  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY })
  }, [])

  return (
    <div className="flex-1 relative overflow-hidden bg-slate-950" onMouseMove={handleMouseMove}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {tooltip && (
        <div
          className="pointer-events-none fixed z-50 bg-slate-900/95 border border-slate-700/60 rounded-xl px-3.5 py-2.5 text-sm shadow-2xl backdrop-blur-sm max-w-xs"
          style={{ left: mousePos.x + 16, top: mousePos.y - 12 }}
        >
          <p className="text-slate-100 font-medium text-sm leading-snug">{tooltip.title}</p>
          <p className="text-slate-500 text-xs mt-0.5">
            {tooltip.domain}
            {tooltip.parentDomain && <span className="text-slate-700"> · {tooltip.parentDomain}</span>}
          </p>
          <p className="text-slate-600 text-xs mt-1">
            {degreeMap.get(tooltip.id) || 0} connections
            {tooltip.isBridge && <span className="ml-2 text-indigo-400/80">◇ bridge</span>}
            {tooltip.isStaged && <span className="ml-2 text-amber-400/80">◌ staged</span>}
          </p>
        </div>
      )}
    </div>
  )
}
