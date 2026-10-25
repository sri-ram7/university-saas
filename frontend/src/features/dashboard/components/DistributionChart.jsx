import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import Card from '@/components/ui/Card'
import { Skeleton } from '@/components/ui'

const COLORS = ['#4F46E5', '#0EA5A0', '#F59E0B', '#E11D48', '#8B5CF6']

export default function DistributionChart({ data, isLoading }) {
  return (
    <Card>
      <p className="mb-4 text-sm font-semibold text-slate-800 dark:text-slate-100">
        Share of total records
      </p>
      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
              {data.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 10, fontSize: 13, border: '1px solid #E2E8F0' }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
