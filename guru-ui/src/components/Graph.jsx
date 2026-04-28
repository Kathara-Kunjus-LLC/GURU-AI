import { useRef, useCallback, useMemo, useEffect, useState } from 'react'
import ForceGraph from 'force-graph'
import { domainColor } from '../lib/colors'

const LINK_COLORS = {
  'prereq': 'rgba(129,140,248,0.7)',
  'builds-into': 'rgba(74,222,128,0.7)',
  'related': 'rgba(148,163,184,0.3)',
}

const LINK_DASH = {
  'prereq': [],
  'builds-into': [4, 4],
  'related': [2, 5],
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

  // Initialize the imperative force-graph instance once
  useEffect(() => {
    if (!containerRef.current || graphRef.current) return
    const el = containerRef.current
    graphRef.current = ForceGraph()(el)
      .nodeId('id')
      .backgroundColor('#020617')
      .nodeCanvasObjectMode(() => 'replace')
      .linkCanvasObjectMode(() => 'replace')
      .cooldownTime(2500)
      .width(el.clientWidth)
      .height(el.clientHeight)

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
    const r = Math.max(4, Math.sqrt(deg) * 3.5)
    const color = domainColor(node.parentDomain)

    let alpha = 1
    if (filters.bridgeOnly && !node.isBridge) alpha = 0.15
    if (searchMatches && searchMatches.size > 0 && !searchMatches.has(node.id)) alpha = 0.15
    if (selectedId && node.id !== selectedId) alpha = Math.min(alpha, 0.6)

    ctx.globalAlpha = alpha

    if (node.isBridge) {
      ctx.beginPath()
      ctx.moveTo(node.x, node.y - r * 1.3)
      ctx.lineTo(node.x + r * 1.1, node.y)
      ctx.lineTo(node.x, node.y + r * 1.3)
      ctx.lineTo(node.x - r * 1.1, node.y)
      ctx.closePath()
    } else {
      ctx.beginPath()
      ctx.arc(node.x, node.y, r, 0, 2 * Math.PI)
    }

    ctx.fillStyle = color
    ctx.fill()

    if (node.id === selectedId) {
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 2 / globalScale
      ctx.stroke()
    }

    const label = node.title.length > 28 ? node.title.slice(0, 27) + '…' : node.title
    const fontSize = Math.max(8, 11 / globalScale)
    ctx.font = `${fontSize}px sans-serif`
    ctx.fillStyle = `rgba(226,232,240,${alpha})`
    ctx.textAlign = 'center'
    ctx.fillText(label, node.x, node.y + r + fontSize + 1)

    ctx.globalAlpha = 1
  }, [degreeMap, filters.bridgeOnly, searchMatches, selectedId])

  const linkCanvasObject = useCallback((link, ctx) => {
    const start = link.source
    const end = link.target
    if (!start?.x || !end?.x) return

    ctx.save()
    ctx.strokeStyle = LINK_COLORS[link.type] ?? 'rgba(148,163,184,0.4)'
    ctx.lineWidth = 1
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
      const deg = Math.max(4, Math.sqrt(degreeMap.get(typeof end === 'object' ? end.id : end) || 1) * 3.5)
      const tipX = end.x - ux * (deg + 2)
      const tipY = end.y - uy * (deg + 2)
      const arrowLen = 6, arrowAngle = 0.4
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

  // Push updated data + callbacks into the graph whenever they change
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
        const r = Math.max(4, Math.sqrt(deg) * 3.5) + 4
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(node.x, node.y, r, 0, 2 * Math.PI)
        ctx.fill()
      })
  }, [graphData, nodeCanvasObject, linkCanvasObject, handleNodeClick, handleNodeHover, onSelectNode, degreeMap])

  // Focus camera on selected node
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
          className="pointer-events-none fixed z-50 bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm shadow-xl max-w-xs"
          style={{ left: mousePos.x + 14, top: mousePos.y - 10 }}
        >
          <p className="text-slate-100 font-medium">{tooltip.title}</p>
          <p className="text-slate-400 text-xs mt-0.5">
            {tooltip.domain} · {tooltip.parentDomain}
          </p>
          <p className="text-slate-500 text-xs">
            {degreeMap.get(tooltip.id) || 0} connections
            {tooltip.isBridge && <span className="ml-2 text-indigo-400">◇ bridge</span>}
          </p>
        </div>
      )}
    </div>
  )
}
