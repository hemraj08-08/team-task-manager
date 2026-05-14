import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { projectService } from '../services'
import { useAuth } from '../context/AuthContext'
import { StatusBadge, PriorityBadge } from '../components/Badges'
import Spinner from '../components/Spinner'
import { format } from 'date-fns'

const ProjectDetailPage = () => {
  const { id } = useParams()
  const { isAdmin } = useAuth()
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectService.getById(id).then(r => r.data.data),
  })

  if (isLoading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size="lg" /></div>
  if (error) return <div className="text-center py-20 text-red-400">Project not found or access denied</div>

  const { tasks = [], ...project } = data

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Link to="/projects" className="text-slate-400 hover:text-white transition-colors">Projects</Link>
        <span className="text-slate-600">/</span>
        <span className="text-slate-200">{project.title}</span>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{project.title}</h1>
            <p className="text-slate-400 max-w-3xl">{project.description || 'No description available.'}</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={project.status} />
            {isAdmin && (
              <button className="btn-secondary py-1.5 px-3 text-sm">Edit Project</button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-slate-700">
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Created By</p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium text-white">
                {project.createdBy?.name?.charAt(0)}
              </div>
              <span className="text-slate-200 text-sm font-medium">{project.createdBy?.name}</span>
            </div>
          </div>
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Dates</p>
            <p className="text-slate-300 text-sm">
              Created: {format(new Date(project.createdAt), 'MMM d, yyyy')}<br/>
              {project.deadline && `Due: ${format(new Date(project.deadline), 'MMM d, yyyy')}`}
            </p>
          </div>
          <div>
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">Team Members ({project.members?.length || 0})</p>
            <div className="flex flex-wrap gap-1">
              {project.members?.length > 0 ? project.members.map(member => (
                <div key={member._id} className="w-8 h-8 rounded-full bg-primary-500/20 border border-primary-500/50 flex items-center justify-center text-sm font-medium text-primary-300" title={member.name}>
                  {member.name?.charAt(0)}
                </div>
              )) : <span className="text-slate-500 text-sm">No members assigned</span>}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Project Tasks ({tasks.length})</h2>
          {isAdmin && (
            <Link to="/tasks" className="btn-primary py-1.5 px-4 text-sm">+ Add Task</Link>
          )}
        </div>
        
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="card text-center py-10 text-slate-500">No tasks for this project yet.</div>
          ) : tasks.map((task) => (
            <Link key={task._id} to={`/tasks/${task._id}`} className="card-hover p-4 block">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">{task.title}</h3>
                  <p className="text-slate-400 text-sm line-clamp-1">{task.description}</p>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex flex-col sm:items-end gap-1">
                    <StatusBadge status={task.status} />
                    <PriorityBadge priority={task.priority} />
                  </div>
                  <div className="hidden sm:block text-right text-xs text-slate-500">
                    <p>Assigned to</p>
                    <p className="font-medium text-slate-300">{task.assignedTo?.name || 'Unassigned'}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProjectDetailPage
