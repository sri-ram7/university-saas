import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import Card from '@/components/ui/Card'
import { Skeleton } from '@/components/ui'

export default function OverviewChart({ data, isLoading }) {
  return (
    <Card>
      <p className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
        Records by category
      </p>
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{ borderRadius: 10, fontSize: 13, border: '1px solid #E2E8F0' }}
              cursor={{ fill: '#F1F5F9' }}
            />
            <Bar dataKey="value" fill="#4F46E5" radius={[6, 6, 0, 0]} maxBarSize={48} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
