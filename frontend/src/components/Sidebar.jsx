import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const navLinks = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/projects', icon: '📁', label: 'Projects' },
  { to: '/tasks', icon: '✅', label: 'Tasks' },
]

const adminLinks = [
  { to: '/team', icon: '👥', label: 'Team Members' },
]

const Sidebar = ({ collapsed, onToggle }) => {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <aside
      className={`fixed left-0 top-0 h-full bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 z-40 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
          ⚡
        </div>
        {!collapsed && (
          <div className="animate-fade-in">
            <p className="font-bold text-white text-sm leading-tight">Team Task</p>
            <p className="text-xs text-slate-500">Manager</p>
          </div>
        )}
        <button
          onClick={onToggle}
          className={`ml-auto text-slate-500 hover:text-white transition-colors ${collapsed ? 'mx-auto' : ''}`}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {!collapsed && (
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-2">
            Main
          </p>
        )}
        {navLinks.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `${isActive ? 'sidebar-link-active' : 'sidebar-link'} ${collapsed ? 'justify-center px-2' : ''}`
            }
            title={collapsed ? label : ''}
          >
            <span className="text-lg flex-shrink-0">{icon}</span>
            {!collapsed && <span className="animate-fade-in">{label}</span>}
          </NavLink>
        ))}

        {isAdmin && (
          <>
            {!collapsed && (
              <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-4 py-2 mt-4">
                Admin
              </p>
            )}
            {adminLinks.map(({ to, icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `${isActive ? 'sidebar-link-active' : 'sidebar-link'} ${collapsed ? 'justify-center px-2' : ''}`
                }
                title={collapsed ? label : ''}
              >
                <span className="text-lg flex-shrink-0">{icon}</span>
                {!collapsed && <span className="animate-fade-in">{label}</span>}
              </NavLink>
            ))}
          </>
        )}
      </nav>

      {/* User section */}
      <div className="p-3 border-t border-slate-800">
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${isActive ? 'sidebar-link-active' : 'sidebar-link'} ${collapsed ? 'justify-center px-2' : ''} mb-1`
          }
          title={collapsed ? 'Profile' : ''}
        >
          <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          {!collapsed && (
            <div className="animate-fade-in min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
          )}
        </NavLink>
        <button
          onClick={handleLogout}
          className={`sidebar-link w-full text-red-400 hover:text-red-300 hover:bg-red-500/10 ${
            collapsed ? 'justify-center px-2' : ''
          }`}
          title={collapsed ? 'Logout' : ''}
        >
          <span className="text-lg">🚪</span>
          {!collapsed && <span className="animate-fade-in">Logout</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
