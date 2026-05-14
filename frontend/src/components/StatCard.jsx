const StatCard = ({ icon, label, value, color = 'primary', trend }) => {
  const colorMap = {
    primary: 'bg-primary-500/10 text-primary-400',
    green: 'bg-emerald-500/10 text-emerald-400',
    yellow: 'bg-amber-500/10 text-amber-400',
    red: 'bg-red-500/10 text-red-400',
    purple: 'bg-accent-500/10 text-accent-400',
    blue: 'bg-blue-500/10 text-blue-400',
  }

  return (
    <div className="stat-card animate-slide-up">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${colorMap[color]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-slate-400 text-sm font-medium truncate">{label}</p>
        <p className="text-3xl font-bold text-white mt-0.5">{value ?? '—'}</p>
        {trend && <p className="text-xs text-slate-500 mt-0.5">{trend}</p>}
      </div>
    </div>
  )
}

export default StatCard
