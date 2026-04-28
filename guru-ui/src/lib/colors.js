export const PARENT_DOMAIN_COLORS = {
  'mathematics': '#818cf8',
  'computer science': '#4ade80',
  'cloud & infrastructure': '#fb923c',
  'finance': '#f87171',
  'applied science': '#c084fc',
}

const DEFAULT_COLOR = '#94a3b8'

export function domainColor(parentDomain) {
  return PARENT_DOMAIN_COLORS[parentDomain?.toLowerCase()] ?? DEFAULT_COLOR
}
