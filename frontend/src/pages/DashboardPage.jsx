import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { dashboardService } from '../services'
import { useAuth } from '../context/AuthContext'
import StatCard from '../components/StatCard'
import { StatusBadge, PriorityBadge } from '../components/Badges'
import Spinner from '../components/Spinner'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format } from 'date-fns'

const DashboardPage = () => {
  const { user, isAdmin } = useAuth()
  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardService.getStats().then(r => r.data.data),
  })

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spinner size="lg" />
    </div>
  )

  if (error) return (
    <div className="text-center py-20 text-red-400">Failed to load dashboard</div>
  )

  const { stats, taskStatusChart, recentTasks, recentProjects } = data

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
          <span className="text-gradient">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-slate-400 mt-1">Here's what's happening with your projects today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon="📁" label="Total Projects" value={stats.totalProjects} color="primary" trend={`${stats.activeProjects} active`} />
        <StatCard icon="✅" label="Total Tasks" value={stats.totalTasks} color="blue" />
        <StatCard icon="🟢" label="Completed" value={stats.completedTasks} color="green" />
        <StatCard icon="🔴" label="Overdue" value={stats.overdueTasks} color="red" />
        <StatCard icon="🔄" label="In Progress" value={stats.inProgressTasks} color="purple" />
        <StatCard icon="⏳" label="Pending" value={stats.pendingTasks} color="yellow" />
        {isAdmin && <StatCard icon="👥" label="Team Members" value={stats.totalMembers} color="primary" />}
        {isAdmin && <StatCard icon="👑" label="Admins" value={stats.totalAdmins} color="purple" />}
      </div>

      {/* Charts + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="card">
          <h2 className="text-lg font-semibold text-white mb-4">Task Status Overview</h2>
          {stats.totalTasks === 0 ? (
            <div className="flex items-center justify-center h-48 text-slate-500">No tasks yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={taskStatusChart}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {taskStatusChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#f1f5f9' }}
                />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '13px' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Recent Tasks */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Tasks</h2>
            <Link to="/tasks" className="text-primary-400 text-sm hover:text-primary-300 transition-colors">View all →</Link>
          </div>
          <div className="space-y-3">
            {recentTasks.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No tasks yet</p>
            ) : recentTasks.map((task) => (
              <Link
                key={task._id}
                to={`/tasks/${task._id}`}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-700/50 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 group-hover:text-white truncate">{task.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{task.projectId?.title}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <StatusBadge status={task.status} />
                  <PriorityBadge priority={task.priority} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Projects */}
      {recentProjects.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Projects</h2>
            <Link to="/projects" className="text-primary-400 text-sm hover:text-primary-300 transition-colors">View all →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentProjects.map((project) => (
              <Link
                key={project._id}
                to={`/projects/${project._id}`}
                className="p-4 rounded-xl bg-slate-700/30 hover:bg-slate-700/60 border border-slate-700/50 hover:border-primary-500/30 transition-all group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <p className="font-medium text-slate-200 group-hover:text-white text-sm truncate">{project.title}</p>
                  <StatusBadge status={project.status} />
                </div>
                <p className="text-xs text-slate-500 truncate">{project.description || 'No description'}</p>
                <p className="text-xs text-slate-600 mt-2">{format(new Date(project.createdAt), 'MMM d, yyyy')}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default DashboardPage
