import { createClient } from '../../../utils/supabase/server'
import { redirect } from 'next/navigation'
import LogoutButton from './logout-button'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-slate-500 mt-1">Welcome back, {user.email}</p>
          </div>
          <LogoutButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/jobs"
            className="p-6 bg-white rounded-lg shadow-sm border hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold mb-2">Jobs</h2>
            <p className="text-slate-600">View, add, and manage your concrete jobs.</p>
          </Link>

          <div className="p-6 bg-white rounded-lg shadow-sm border opacity-50">
            <h2 className="text-xl font-semibold mb-2">Bidding</h2>
            <p className="text-slate-600">Track bids and estimates. (Coming soon)</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm border opacity-50">
            <h2 className="text-xl font-semibold mb-2">Timeline</h2>
            <p className="text-slate-600">View project timelines and schedules. (Coming soon)</p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-sm border opacity-50">
            <h2 className="text-xl font-semibold mb-2">Team</h2>
            <p className="text-slate-600">Manage your crew and assignments. (Coming soon)</p>
          </div>
        </div>
      </div>
    </main>
  )
}
