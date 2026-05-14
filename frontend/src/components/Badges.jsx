const STATUS_CONFIG = {
  pending: { label: 'Pending', className: 'badge-pending', dot: '🟡' },
  'in-progress': { label: 'In Progress', className: 'badge-in-progress', dot: '🔵' },
  completed: { label: 'Completed', className: 'badge-completed', dot: '🟢' },
  overdue: { label: 'Overdue', className: 'badge-overdue', dot: '🔴' },
  active: { label: 'Active', className: 'badge-completed', dot: '🟢' },
  'on-hold': { label: 'On Hold', className: 'badge-pending', dot: '🟡' },
  archived: { label: 'Archived', className: 'badge-overdue', dot: '⚫' },
}

const PRIORITY_CONFIG = {
  low: { label: 'Low', className: 'badge-low' },
  medium: { label: 'Medium', className: 'badge-medium' },
  high: { label: 'High', className: 'badge-high' },
  critical: { label: 'Critical', className: 'badge-critical' },
}

export const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  return <span className={config.className}><span>{config.dot}</span>{config.label}</span>
}

export const PriorityBadge = ({ priority }) => {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.medium
  return <span className={config.className}>{config.label}</span>
}
