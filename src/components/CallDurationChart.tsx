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
        <div className="p-4 bg-white/5 rounded-2xl backdrop-blur-md shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Call Duration Analysis</h2>
            <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6ae3ff" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#6ae3ff" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="time" stroke="#aaa" />
                    <YAxis stroke="#aaa" />
                    <Tooltip />
                    <Area type="monotone" dataKey="duration" stroke="#6ae3ff" fillOpacity={1} fill="url(#colorDuration)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
