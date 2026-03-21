import { createAdminClient } from '@/utils/supabase/admin'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Activity, Users, FileText, Settings, ShieldAlert, ArrowLeft } from 'lucide-react'

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch admin data using the service role key
  const adminDb = createAdminClient()
  
  // 1. Fetch total users
  const { data: usersData, error: usersError } = await adminDb.auth.admin.listUsers()
  const totalUsers = usersData?.users?.length || 0
  const allUsers = usersData?.users || []

  // 2. Fetch total notes across all users
  const { data: notesData, error: notesError } = await adminDb
    .from('notes')
    .select('id', { count: 'exact' })
  const totalNotes = notesData?.length || 0

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-8 relative overflow-hidden text-slate-200 font-sans">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-500/10 blur-[100px] rounded-full mix-blend-screen" />
        <div className="absolute top-1/2 -right-20 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col h-full gap-8">
        
        {/* Header */}
        <header className="flex items-center justify-between frosted-crystal rounded-3xl p-6 border border-red-500/20 shadow-2xl bg-black/40">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10 text-white/60 hover:text-white">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white italic tracking-tighter uppercase text-glow flex items-center gap-3">
                <ShieldAlert className="text-red-500" /> Admin Node
              </h1>
              <p className="text-[10px] sm:text-xs font-black text-red-400/60 uppercase tracking-[0.3em]">
                System Analytics & User Management
              </p>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="px-4 py-2 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-[10px] font-black uppercase tracking-widest">
              High Privilege Area
            </span>
          </div>
        </header>

        {/* Analytics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="frosted-crystal rounded-3xl p-6 border border-white/10 bg-white/5 flex items-start gap-4">
            <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Users size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Total Users</p>
              <h3 className="text-3xl font-black italic text-white">{totalUsers}</h3>
            </div>
          </div>
          <div className="frosted-crystal rounded-3xl p-6 border border-white/10 bg-white/5 flex items-start gap-4">
            <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <FileText size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Global Notes</p>
              <h3 className="text-3xl font-black italic text-white">{totalNotes}</h3>
            </div>
          </div>
          <div className="frosted-crystal rounded-3xl p-6 border border-white/10 bg-white/5 flex items-start gap-4">
            <div className="p-4 rounded-2xl bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">System Health</p>
              <h3 className="text-3xl font-black italic text-white text-glow">100%</h3>
            </div>
          </div>
          <div className="frosted-crystal rounded-3xl p-6 border border-white/10 bg-white/5 flex items-start gap-4">
            <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Settings size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">API Status</p>
              <h3 className="text-xl mt-1 font-black italic text-white">ONLINE</h3>
            </div>
          </div>
        </div>

        {/* User Management List */}
        <div className="flex-1 min-h-0 frosted-crystal rounded-3xl p-6 sm:p-8 border border-white/10 bg-white/5 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">Registered Accounts</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-4">
            {allUsers.map((u) => (
              <div key={u.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-white/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center font-black text-white/60">
                    {u.email?.[0].toUpperCase() || '?'}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{u.email}</h4>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
                      Joined: {new Date(u.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                   <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black text-white/60 uppercase tracking-widest flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                   </div>
                </div>
              </div>
            ))}
            
            {allUsers.length === 0 && (
              <div className="flex items-center justify-center h-40 text-sm font-medium text-white/40">
                No users found.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
