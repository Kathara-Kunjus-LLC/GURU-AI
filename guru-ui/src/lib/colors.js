export const PARENT_DOMAIN_COLORS = {
  'mathematics': '#818cf8',
  'computer science': '#4ade80',
  'cloud & infrastructure': '#fb923c',
  'finance': '#f87171',
  'applied science': '#c084fc',
}

function hashColor(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 60%, 65%)`
}

export function domainColor(parentDomain) {
  if (!parentDomain) return '#94a3b8'
  return PARENT_DOMAIN_COLORS[parentDomain.toLowerCase()] ?? hashColor(parentDomain)
}
