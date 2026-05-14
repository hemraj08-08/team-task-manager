import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { taskService } from '../services'
import { useAuth } from '../context/AuthContext'
import { StatusBadge, PriorityBadge } from '../components/Badges'
import Spinner from '../components/Spinner'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const TaskDetailPage = () => {
  const { id } = useParams()
  const { user, isAdmin } = useAuth()
  const queryClient = useQueryClient()
  const [commentText, setCommentText] = useState('')
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['task', id],
    queryFn: () => taskService.getById(id).then(r => r.data.data),
  })

  const updateStatusMutation = useMutation({
    mutationFn: (status) => taskService.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['task', id])
      queryClient.invalidateQueries(['tasks'])
      toast.success('Task status updated')
    },
    onError: () => toast.error('Failed to update status'),
  })

  const addCommentMutation = useMutation({
    mutationFn: (text) => taskService.addComment(id, text),
    onSuccess: () => {
      queryClient.invalidateQueries(['task', id])
      setCommentText('')
      toast.success('Comment added')
    },
    onError: () => toast.error('Failed to add comment'),
  })

  if (isLoading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size="lg" /></div>
  if (error) return <div className="text-center py-20 text-red-400">Task not found or access denied</div>

  const { comments = [], ...task } = data
  const isAssignee = task.assignedTo?._id === user._id
  const canUpdateStatus = isAdmin || isAssignee

  const handleAddComment = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    addCommentMutation.mutate(commentText)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Link to="/tasks" className="text-slate-400 hover:text-white transition-colors">Tasks</Link>
        <span className="text-slate-600">/</span>
        <span className="text-slate-200 line-clamp-1">{task.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Task Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-2xl font-bold text-white">{task.title}</h1>
              <div className="flex gap-2">
                {canUpdateStatus ? (
                  <select
                    className="bg-slate-800 border border-slate-600 text-sm font-medium text-slate-200 rounded-lg px-3 py-1.5 outline-none cursor-pointer hover:border-primary-500 focus:ring-2 focus:ring-primary-500/50 transition-all"
                    value={task.status}
                    onChange={(e) => updateStatusMutation.mutate(e.target.value)}
                    disabled={updateStatusMutation.isPending}
                  >
                    <option value="pending">🟡 Pending</option>
                    <option value="in-progress">🔵 In Progress</option>
                    <option value="completed">🟢 Completed</option>
                    {task.status === 'overdue' && <option value="overdue">🔴 Overdue</option>}
                  </select>
                ) : (
                  <StatusBadge status={task.status} />
                )}
              </div>
            </div>
            
            <div className="prose prose-invert max-w-none text-slate-300">
              <p className="whitespace-pre-wrap">{task.description || 'No description provided.'}</p>
            </div>
          </div>

          {/* Comments Section */}
          <div className="card">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <span>💬</span> Comments ({comments.length})
            </h2>
            
            <div className="space-y-4 mb-6">
              {comments.length === 0 ? (
                <p className="text-slate-500 text-sm italic">No comments yet. Be the first to comment!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="flex gap-3 animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-1">
                      {comment.userId?.name?.charAt(0)}
                    </div>
                    <div className="bg-slate-700/50 rounded-2xl rounded-tl-none p-3 flex-1 border border-slate-700">
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="font-medium text-slate-200 text-sm">{comment.userId?.name}</span>
                        <span className="text-xs text-slate-500">{format(new Date(comment.createdAt), 'MMM d, h:mm a')}</span>
                      </div>
                      <p className="text-slate-300 text-sm whitespace-pre-wrap">{comment.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-3">
              <input
                type="text"
                placeholder="Add a comment..."
                className="input py-2"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={addCommentMutation.isPending}
              />
              <button 
                type="submit" 
                className="btn-primary py-2 px-4 shrink-0 flex items-center gap-2"
                disabled={!commentText.trim() || addCommentMutation.isPending}
              >
                {addCommentMutation.isPending ? <Spinner size="sm" /> : 'Send'}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="card space-y-4">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Project</p>
              <Link to={`/projects/${task.projectId?._id}`} className="text-primary-400 hover:text-primary-300 font-medium">
                📁 {task.projectId?.title || 'Unknown'}
              </Link>
            </div>
            
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Assigned To</p>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-white">
                  {task.assignedTo?.name?.charAt(0) || '?'}
                </div>
                <span className="text-slate-200">{task.assignedTo?.name || 'Unassigned'}</span>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Priority</p>
              <PriorityBadge priority={task.priority} />
            </div>
            
            {task.dueDate && (
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Due Date</p>
                <p className={`text-sm ${new Date(task.dueDate) < new Date() && task.status !== 'completed' ? 'text-red-400 font-medium' : 'text-slate-300'}`}>
                  📅 {format(new Date(task.dueDate), 'MMM d, yyyy')}
                </p>
              </div>
            )}
            
            <div className="pt-4 border-t border-slate-700">
              <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Created By</p>
              <p className="text-slate-300 text-sm">{task.createdBy?.name}</p>
              <p className="text-slate-500 text-xs mt-1">{format(new Date(task.createdAt), 'MMM d, yyyy')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDetailPage
