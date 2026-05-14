import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { projectService, userService } from '../services'
import { useAuth } from '../context/AuthContext'
import { StatusBadge } from '../components/Badges'
import Modal from '../components/Modal'
import Spinner from '../components/Spinner'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const ProjectsPage = () => {
  const { isAdmin } = useAuth()
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getAll().then(r => r.data.data),
  })

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll().then(r => r.data.data),
    enabled: isAdmin,
  })

  const createMutation = useMutation({
    mutationFn: (data) => projectService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects'])
      toast.success('Project created!')
      setShowModal(false)
      reset()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create project'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => projectService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects'])
      toast.success('Project deleted')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete'),
  })

  const onSubmit = (data) => {
    const members = data.members ? (Array.isArray(data.members) ? data.members : [data.members]) : []
    createMutation.mutate({ ...data, members: members.filter(Boolean) })
  }

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]"><Spinner size="lg" /></div>
  )

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Projects</h1>
          <p className="text-slate-400 mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
        </div>
        {isAdmin && (
          <button id="create-project-btn" onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
            <span>+</span> New Project
          </button>
        )}
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="card text-center py-20">
          <p className="text-5xl mb-4">📁</p>
          <p className="text-slate-400 text-lg">No projects yet</p>
          {isAdmin && (
            <button onClick={() => setShowModal(true)} className="btn-primary mt-4">
              Create your first project
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project._id} className="card-hover group animate-slide-up">
              <div className="flex items-start justify-between gap-2 mb-3">
                <Link to={`/projects/${project._id}`} className="font-semibold text-white hover:text-primary-400 transition-colors truncate">
                  {project.title}
                </Link>
                <StatusBadge status={project.status} />
              </div>

              <p className="text-slate-400 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                {project.description || 'No description provided'}
              </p>

              {/* Progress bar */}
              {project.taskCount > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-accent-500 h-1.5 rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-700">
                <span>{project.taskCount || 0} tasks</span>
                <span>{project.members?.length || 0} members</span>
                <span>{format(new Date(project.createdAt), 'MMM d')}</span>
              </div>

              {isAdmin && (
                <div className="flex gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link to={`/projects/${project._id}`} className="btn-secondary text-xs py-1.5 px-3 flex-1 text-center">
                    View
                  </Link>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete this project and all its tasks?')) {
                        deleteMutation.mutate(project._id)
                      }
                    }}
                    className="btn-danger text-xs py-1.5 px-3"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); reset() }} title="Create New Project">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Project Title *</label>
            <input id="project-title" className="input" placeholder="e.g. Website Redesign" {...register('title', { required: 'Title is required' })} />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="label">Description</label>
            <textarea id="project-desc" className="input min-h-[80px] resize-none" placeholder="What is this project about?" {...register('description')} />
          </div>
          <div>
            <label className="label">Status</label>
            <select id="project-status" className="input" {...register('status')}>
              <option value="active">Active</option>
              <option value="on-hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="label">Deadline</label>
            <input id="project-deadline" type="date" className="input" {...register('deadline')} />
          </div>
          {users.length > 0 && (
            <div>
              <label className="label">Add Members</label>
              <select id="project-members" className="input" multiple {...register('members')}>
                {users.map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                ))}
              </select>
              <p className="text-slate-500 text-xs mt-1">Hold Ctrl/Cmd to select multiple</p>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setShowModal(false); reset() }} className="btn-secondary flex-1">
              Cancel
            </button>
            <button id="submit-project-btn" type="submit" disabled={createMutation.isPending} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {createMutation.isPending ? <Spinner size="sm" /> : null}
              {createMutation.isPending ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ProjectsPage
