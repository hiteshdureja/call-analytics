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
        <div className="p-8 bg-card border border-[#2C2C3F] rounded-5xl shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-8">Call Duration Analysis</h2>
            <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#855CF1" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#855CF1" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 13, fontFamily: 'Outfit' }} axisLine={{ stroke: '#2C2C3F' }} tickLine={false} dy={10} />
                    <YAxis stroke="#4b5563" tick={{ fill: '#9ca3af', fontSize: 13, fontFamily: 'Outfit' }} axisLine={{ stroke: '#2C2C3F' }} tickLine={false} dx={-10} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1C1C28', borderRadius: '16px', border: '1px solid #2C2C3F', boxShadow: '0 10px 30px -5px rgba(0, 0, 0, 0.5)' }}
                        itemStyle={{ color: '#855CF1', fontWeight: 600, fontFamily: 'Outfit' }}
                        labelStyle={{ color: '#9ca3af', fontSize: '13px', marginBottom: '8px', fontFamily: 'Outfit' }}
                        cursor={{ stroke: '#2C2C3F', strokeWidth: 2, strokeDasharray: '4 4' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="duration"
                        stroke="#855CF1"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorDuration)"
                        activeDot={{ r: 8, strokeWidth: 0, fill: '#855CF1', opacity: 0.8 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
