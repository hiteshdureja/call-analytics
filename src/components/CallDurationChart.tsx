import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

// Sample data for the call duration chart
const data = [
    { time: "00:00", duration: 0 },
    { time: "01:00", duration: 30 },
    { time: "02:00", duration: 80 },
    { time: "03:00", duration: 50 },
    { time: "04:00", duration: 90 },
]

export default function CallDurationChart() {
    return (
        <div className="p-6 bg-white/60 backdrop-blur-lg border border-white/30 rounded-2xl shadow-md">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Call Duration Analysis</h2>
            <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#9ca3af" tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <YAxis stroke="#9ca3af" tick={{ fill: '#6b7280', fontSize: 12 }} />
                    <Tooltip
                        contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.1)' }}
                        itemStyle={{ color: '#4f46e5', fontWeight: 600 }}
                        labelStyle={{ color: '#6b7280', fontSize: '12px', marginBottom: '4px' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="duration"
                        stroke="#6366f1"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorDuration)"
                        activeDot={{ r: 6, strokeWidth: 0, fill: '#4f46e5' }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
