import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { taskService, projectService, userService } from '../services'
import { useAuth } from '../context/AuthContext'
import { StatusBadge, PriorityBadge } from '../components/Badges'
import Modal from '../components/Modal'
import Spinner from '../components/Spinner'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const TasksPage = () => {
  const { user, isAdmin } = useAuth()
  const queryClient = useQueryClient()
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState('all') // all, pending, in-progress, completed
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks', filter],
    queryFn: () => taskService.getAll(filter !== 'all' ? { status: filter } : {}).then(r => r.data.data),
  })

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getAll().then(r => r.data.data),
    enabled: isAdmin, // Only needed for admin creating tasks
  })

  const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll().then(r => r.data.data),
    enabled: isAdmin,
  })

  const createMutation = useMutation({
    mutationFn: (data) => taskService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks'])
      queryClient.invalidateQueries(['dashboard'])
      toast.success('Task created!')
      setShowModal(false)
      reset()
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create task'),
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => taskService.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks'])
      queryClient.invalidateQueries(['dashboard'])
      toast.success('Status updated')
    },
    onError: (err) => toast.error('Failed to update status'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => taskService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks'])
      queryClient.invalidateQueries(['dashboard'])
      toast.success('Task deleted')
    },
  })

  const onSubmit = (data) => {
    createMutation.mutate(data)
  }

  if (isLoading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Tasks</h1>
          <p className="text-slate-400 mt-1">Manage and track all tasks</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="overdue">Overdue</option>
          </select>
          {isAdmin && (
            <button id="create-task-btn" onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
              <span>+</span> New Task
            </button>
          )}
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="card text-center py-20">
          <p className="text-5xl mb-4">✅</p>
          <p className="text-slate-400 text-lg">No tasks found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {tasks.map((task) => (
            <div key={task._id} className="card-hover group animate-slide-up flex flex-col h-full">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Link to={`/tasks/${task._id}`} className="font-semibold text-white hover:text-primary-400 transition-colors line-clamp-2">
                  {task.title}
                </Link>
                <div className="flex flex-col gap-1 items-end shrink-0">
                  <StatusBadge status={task.status} />
                  <PriorityBadge priority={task.priority} />
                </div>
              </div>
              
              <p className="text-sm text-slate-400 line-clamp-2 mb-4 flex-1">
                {task.description || 'No description'}
              </p>
              
              <div className="mt-auto space-y-3 pt-3 border-t border-slate-700/50">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    📁 <span className="truncate max-w-[100px]">{task.projectId?.title || 'Unknown Project'}</span>
                  </span>
                  {task.dueDate && (
                    <span className="flex items-center gap-1">
                      📅 {format(new Date(task.dueDate), 'MMM d, yyyy')}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white" title={task.assignedTo?.name || 'Unassigned'}>
                      {task.assignedTo?.name?.charAt(0) || '?'}
                    </div>
                    <span className="text-slate-300 text-xs truncate max-w-[120px]">
                      {task.assignedTo?.name || 'Unassigned'}
                    </span>
                  </div>
                  
                  {/* Status Dropdown for assignee or admin */}
                  {(isAdmin || (task.assignedTo && task.assignedTo._id === user._id)) && (
                    <select
                      className="bg-slate-800 border border-slate-600 text-xs text-slate-300 rounded-lg px-2 py-1 outline-none"
                      value={task.status}
                      onChange={(e) => updateStatusMutation.mutate({ id: task._id, status: e.target.value })}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  )}
                </div>
              </div>
              
              {isAdmin && (
                 <div className="flex gap-2 mt-3 pt-3 border-t border-slate-700/50 opacity-0 group-hover:opacity-100 transition-opacity">
                 <Link to={`/tasks/${task._id}`} className="btn-secondary text-xs py-1.5 px-3 flex-1 text-center">
                   View Details
                 </Link>
                 <button
                   onClick={(e) => {
                     e.preventDefault()
                     if (window.confirm('Delete this task?')) {
                       deleteMutation.mutate(task._id)
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

      {/* Create Task Modal */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); reset() }} title="Create New Task">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label">Task Title *</label>
            <input id="task-title" className="input" placeholder="What needs to be done?" {...register('title', { required: 'Title is required' })} />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <label className="label">Description</label>
            <textarea id="task-desc" className="input min-h-[80px] resize-none" placeholder="Task details..." {...register('description')} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Project *</label>
              <select id="task-project" className="input" {...register('projectId', { required: 'Project is required' })}>
                <option value="">Select Project</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.title}</option>)}
              </select>
              {errors.projectId && <p className="text-red-400 text-xs mt-1">{errors.projectId.message}</p>}
            </div>
            <div>
              <label className="label">Assign To</label>
              <select id="task-assignee" className="input" {...register('assignedTo')}>
                <option value="">Unassigned</option>
                {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Priority</label>
              <select id="task-priority" className="input" {...register('priority')}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="label">Due Date</label>
              <input id="task-due-date" type="date" className="input" {...register('dueDate')} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { setShowModal(false); reset() }} className="btn-secondary flex-1">
              Cancel
            </button>
            <button id="submit-task-btn" type="submit" disabled={createMutation.isPending} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {createMutation.isPending ? <Spinner size="sm" /> : null}
              {createMutation.isPending ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default TasksPage
