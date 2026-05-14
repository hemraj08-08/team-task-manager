import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '../services'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/Spinner'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const TeamMembersPage = () => {
  const { user: currentUser } = useAuth()
  const queryClient = useQueryClient()
  
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll().then(r => r.data.data),
  })

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }) => userService.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
      toast.success('Role updated')
    },
    onError: () => toast.error('Failed to update role'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => userService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
      toast.success('User deleted')
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete user'),
  })

  if (isLoading) return <div className="flex items-center justify-center min-h-[60vh]"><Spinner size="lg" /></div>

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white">Team Members</h1>
        <p className="text-slate-400 mt-1">Manage users and their roles</p>
      </div>

      <div className="card overflow-hidden !p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-800/50 text-xs uppercase text-slate-500 border-b border-slate-700">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {users.map((member) => (
                <tr key={member._id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center font-bold text-white">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-white">{member.name}</p>
                        <p className="text-slate-500 text-xs">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {member._id === currentUser._id ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-primary-500/10 text-primary-400 border border-primary-500/20">
                        Admin (You)
                      </span>
                    ) : (
                      <select
                        className="bg-slate-900 border border-slate-700 text-slate-300 rounded-lg px-2 py-1 text-xs outline-none focus:border-primary-500"
                        value={member.role}
                        onChange={(e) => updateRoleMutation.mutate({ id: member._id, role: e.target.value })}
                        disabled={updateRoleMutation.isPending}
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(member.createdAt), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {member._id !== currentUser._id && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Remove ${member.name} from the system?`)) {
                            deleteMutation.mutate(member._id)
                          }
                        }}
                        className="text-red-400 hover:text-red-300 font-medium transition-colors opacity-0 group-hover:opacity-100"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TeamMembersPage
