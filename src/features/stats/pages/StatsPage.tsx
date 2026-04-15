import { useEffect, useMemo } from 'react'
import { useSessionStore } from '@/features/sessions/store/sessionStore'
import { PageHeader } from '@/components/layout/PageHeader'
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner'
import { toolLabels, taskTypeLabels, statusLabels } from '@/lib/labels'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from 'recharts'

const STATUS_COLORS: Record<string, string> = {
  success: '#7a9e87',
  partial: '#b5c9bc',
  failed: '#f87171',
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-widest text-gray-400">{label}</p>
      <p className="mt-2 text-3xl font-bold text-[#1A1A1A]">{value}</p>
    </div>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400 mb-3">{title}</h2>
  )
}

export function StatsPage() {
  const { sessions, isLoading, fetchAll } = useSessionStore()

  useEffect(() => {
    if (sessions.length === 0) void fetchAll()
  }, [fetchAll, sessions.length])

  const stats = useMemo(() => {
    if (sessions.length === 0) return null

    // Totalen
    const totalSessions = sessions.length
    const uniqueMembers = new Set(sessions.map((s) => s.userId)).size

    // Status verdeling
    const statusCount: Record<string, number> = { success: 0, partial: 0, failed: 0 }
    sessions.forEach((s) => { statusCount[s.status] = (statusCount[s.status] ?? 0) + 1 })
    const statusData = Object.entries(statusCount).map(([status, count]) => ({
      name: statusLabels[status] ?? status,
      value: count,
      status,
    }))

    // AI tools
    const toolCount: Record<string, number> = {}
    sessions.forEach((s) => {
      s.aiTools?.forEach((t) => { toolCount[t] = (toolCount[t] ?? 0) + 1 })
    })
    const toolData = Object.entries(toolCount)
      .map(([tool, count]) => ({ name: toolLabels[tool] ?? tool, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)

    // TaskTypes
    const typeCount: Record<string, number> = {}
    sessions.forEach((s) => {
      if (s.taskType) typeCount[s.taskType] = (typeCount[s.taskType] ?? 0) + 1
    })
    const typeData = Object.entries(typeCount)
      .map(([type, count]) => ({ name: taskTypeLabels[type] ?? type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)

    // Sessies per week (laatste 12 weken)
    const now = new Date()
    const weeks: { label: string; count: number }[] = []
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - i * 7 - now.getDay())
      weekStart.setHours(0, 0, 0, 0)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 7)
      const count = sessions.filter((s) => {
        const d = new Date(s.createdAt)
        return d >= weekStart && d < weekEnd
      }).length
      const label = weekStart.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
      weeks.push({ label, count })
    }

    return { totalSessions, uniqueMembers, statusData, toolData, typeData, weeks }
  }, [sessions])

  if (isLoading && sessions.length === 0) {
    return (
      <div className="flex justify-center py-16">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div>
        <PageHeader title="Inzichten" />
        <div className="rounded-2xl bg-white p-10 shadow-sm text-center text-gray-400 text-sm">
          Nog geen sessies om inzichten van te tonen.
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Inzichten" />

      {/* Totalen */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        <StatCard label="Sessies totaal" value={stats.totalSessions} />
        <StatCard label="Teamleden actief" value={stats.uniqueMembers} />
        <StatCard
          label="Gelukt"
          value={`${Math.round(((stats.statusData.find((s) => s.status === 'success')?.value ?? 0) / stats.totalSessions) * 100)}%`}
        />
      </div>

      {/* Sessies over tijd */}
      <div className="rounded-2xl bg-white p-5 shadow-sm mb-4">
        <SectionTitle title="Sessies per week (laatste 12 weken)" />
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={stats.weeks} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9ca3af' }} interval={2} />
            <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} allowDecimals={false} />
            <Tooltip
              contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 12 }}
              labelStyle={{ fontWeight: 600 }}
            />
            <Line type="monotone" dataKey="count" stroke="#7a9e87" strokeWidth={2}
              dot={{ r: 3, fill: '#7a9e87' }} name="Sessies" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Resultaat verdeling */}
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <SectionTitle title="Resultaat" />
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={stats.statusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                dataKey="value" paddingAngle={3}>
                {stats.statusData.map((entry) => (
                  <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? '#d1d5db'} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 12 }}
                formatter={(value, name) => [value, name]}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {stats.statusData.map((entry) => (
              <div key={entry.status} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: STATUS_COLORS[entry.status] ?? '#d1d5db' }} />
                <span className="text-xs text-gray-500">{entry.name} ({entry.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI tools */}
        {stats.toolData.length > 0 && (
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <SectionTitle title="Meest gebruikte AI tools" />
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={stats.toolData} layout="vertical"
                margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
                <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} width={58} />
                <Tooltip
                  contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 12 }}
                  cursor={{ fill: '#f3f4f6' }}
                />
                <Bar dataKey="count" fill="#7a9e87" radius={[0, 4, 4, 0]} name="Sessies" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Top thema's */}
      {stats.typeData.length > 0 && (
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <SectionTitle title="Top thema's" />
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={stats.typeData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#9ca3af' }} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: '1px solid #e5e7eb', fontSize: 12 }}
                cursor={{ fill: '#f3f4f6' }}
              />
              <Bar dataKey="count" fill="#b5c9bc" radius={[4, 4, 0, 0]} name="Sessies" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
