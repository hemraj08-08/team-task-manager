import { useAuth } from '../context/AuthContext'
import { useForm } from 'react-hook-form'
import { authService } from '../services'
import { useState } from 'react'
import toast from 'react-hot-toast'
import Spinner from '../components/Spinner'

const ProfilePage = () => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    }
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await authService.updateProfile({ name: data.name })
      toast.success('Profile updated successfully')
      // A page reload is the simplest way to reflect the new name in Context/Sidebar
      window.location.reload()
    } catch (err) {
      toast.error('Failed to update profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account details</p>
      </div>

      <div className="card">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-slate-700">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-4xl font-bold text-white shadow-lg shadow-primary-500/20">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-slate-400">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-slate-700 text-slate-300 capitalize border border-slate-600">
              Role: {user?.role}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="label">Full Name</label>
            <input
              type="text"
              className="input max-w-md"
              {...register('name', { required: 'Name is required' })}
            />
            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="label">Email Address (Read Only)</label>
            <input
              type="email"
              className="input max-w-md bg-slate-800/50 text-slate-500"
              disabled
              {...register('email')}
            />
            <p className="text-xs text-slate-500 mt-1">Email cannot be changed after registration.</p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center gap-2"
            >
              {isLoading ? <Spinner size="sm" /> : null}
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfilePage
