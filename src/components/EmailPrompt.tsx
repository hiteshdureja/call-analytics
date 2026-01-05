import { useState } from "react"
import { supabase } from "../lib/supabaseClient"
import SadPathChart, { type HierarchicalChartData } from "./SadPathChart"

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl ${className}`}>
        {children}
    </div>
)

const Button = ({
    children,
    onClick,
    variant = "primary",
    className = "",
    disabled = false
}: {
    children: React.ReactNode;
    onClick: () => void;
    variant?: "primary" | "secondary" | "danger" | "ghost";
    className?: string;
    disabled?: boolean;
}) => {
    const variants = {
        primary: "bg-accent text-black hover:bg-accent/90",
        secondary: "bg-white/10 text-white hover:bg-white/20 border border-white/10",
        danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20",
        ghost: "bg-transparent text-gray-400 hover:text-white"
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    )
}

const Input = ({
    value,
    onChange,
    type = "text",
    className = "",
    label
}: {
    value: string | number;
    onChange: (val: string) => void;
    type?: string;
    className?: string;
    label?: string;
}) => (
    <div className="w-full">
        {label && <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wider font-semibold">{label}</label>}
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all ${className}`}
        />
    </div>
)

export default function EmailPrompt() {
    const [email, setEmail] = useState("")
    const [data, setData] = useState<HierarchicalChartData | null>(null)
    const [previousData, setPreviousData] = useState<HierarchicalChartData | null>(null)
    const [loaded, setLoaded] = useState(false)
    const [isEditing, setIsEditing] = useState(false)

    const getDefaultData = (): HierarchicalChartData => ({
        innerRing: [
            { name: 'Language Issues', value: 75 },
            { name: 'Hostility Issues', value: 25 },
        ],
        outerRing: [
            { name: 'Assistant did not speak French', value: 20 },
            { name: 'Unsupported Language', value: 35 },
            { name: 'Assistant did not speak Spanish', value: 20 },
            { name: 'Verbal Aggression', value: 15 },
            { name: 'Customer Hostility', value: 10 },
            { name: 'User refused to confirm identity', value: 12 },
            { name: 'Caller Identification', value: 10 },
            { name: 'Incorrect caller identity', value: 8 },
        ],
    })

    const loadData = async (email: string) => {
        if (!email) return

        try {
            const { data: supabaseData, error } = await supabase
                .from("user_data")
                .select("chart_data")
                .eq("email", email)
                .single()

            if (error && error.code !== 'PGRST116') {
                console.error('Error loading data:', error)
            }

            if (supabaseData && supabaseData.chart_data) {
                setData(supabaseData.chart_data)
                setPreviousData(supabaseData.chart_data)
            } else {
                const defaultData = getDefaultData()
                setData(defaultData)
                setPreviousData(null)
            }
            setLoaded(true)
        } catch (error) {
            console.error('Error in loadData:', error)
            const defaultData = getDefaultData()
            setData(defaultData)
            setPreviousData(null)
            setLoaded(true)
        }
    }

    const handleDataChange = (ring: 'innerRing' | 'outerRing', index: number, val: string) => {
        if (!data) return
        const newValue = parseInt(val) || 0
        const newData = { ...data }
        newData[ring][index].value = newValue
        setData({ ...newData })
    }

    const handleSaveClick = () => {
        if (!data) return

        if (previousData) {
            const msg = `Overwrite Existing Data?

Previous Values:
Inner: ${previousData.innerRing.map(i => `${i.name}: ${i.value}`).join(', ')}
Outer: ${previousData.outerRing.map(i => `${i.name}: ${i.value}`).join(', ')}

New Values:
Inner: ${data.innerRing.map(i => `${i.name}: ${i.value}`).join(', ')}
Outer: ${data.outerRing.map(i => `${i.name}: ${i.value}`).join(', ')}

Do you want to overwrite?`

            if (window.confirm(msg)) {
                saveDataToSupabase(data)
            }
        } else {
            saveDataToSupabase(data)
        }
    }

    const saveDataToSupabase = async (chartData: HierarchicalChartData) => {
        try {
            const { error } = await supabase.from("user_data").upsert({ email, chart_data: chartData })
            if (error) {
                console.error('Error saving data:', error)
                alert('Failed to save data. Please check your Supabase configuration.')
                return
            }
            setData(chartData)
            setPreviousData(chartData)
            setIsEditing(false)
        } catch (error) {
            console.error('Error in saveDataToSupabase:', error)
            alert('Failed to save data. Please check your Supabase configuration.')
        }
    }

    const handleCancelEdit = () => {
        setIsEditing(false)
        // Revert to previous data if we cancel without saving
        if (previousData) {
            setData(previousData)
        } else {
            // Reload default if no previous data existed (edge case)
            setData(getDefaultData())
        }
    }

    if (!loaded) {
        return (
            <Card className="max-w-md w-full mx-auto mt-10">
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Welcome Back</h3>
                    <p className="text-gray-400 text-sm">Enter your email to view your analytics dashboard</p>
                </div>
                <div className="space-y-4">
                    <Input
                        value={email}
                        onChange={setEmail}
                        label="Email Address"
                        type="email"
                        className="text-lg"
                    />
                    <Button onClick={() => loadData(email)} className="w-full py-3">
                        Load Dashboard
                    </Button>
                </div>
            </Card>
        )
    }

    return (
        <Card className="mt-6">
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        Call Reasons Analysis
                        {previousData && <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/20">Synced</span>}
                    </h2>
                    <p className="text-sm text-gray-400 mt-1">Breakdown of call failure reasons</p>
                </div>

                {!isEditing && (
                    <Button variant="secondary" onClick={() => setIsEditing(true)}>
                        Edit Data
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className={`lg:col-span-2 order-2 lg:order-1 transition-all duration-500 ${isEditing ? 'opacity-50 blur-sm pointer-events-none' : 'opacity-100'}`}>
                    <SadPathChart data={data || undefined} />
                </div>

                {isEditing && data && (
                    <div className="lg:col-span-1 order-1 lg:order-2 flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex-1 space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar mb-4">
                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                <h3 className="text-accent font-semibold mb-3 text-sm uppercase tracking-wider">Inner Ring (Categories)</h3>
                                <div className="space-y-3">
                                    {data.innerRing.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <span className="text-xs text-gray-400 w-1/2 truncate" title={item.name}>{item.name}</span>
                                            <Input
                                                value={item.value}
                                                onChange={(v) => handleDataChange('innerRing', idx, v)}
                                                type="number"
                                                className="text-right font-mono"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                                <h3 className="text-blue-400 font-semibold mb-3 text-sm uppercase tracking-wider">Outer Ring (Details)</h3>
                                <div className="space-y-3">
                                    {data.outerRing.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <span className="text-xs text-gray-400 w-1/2 truncate" title={item.name}>{item.name}</span>
                                            <Input
                                                value={item.value}
                                                onChange={(v) => handleDataChange('outerRing', idx, v)}
                                                type="number"
                                                className="text-right font-mono"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2 border-t border-white/10">
                            <Button variant="ghost" onClick={handleCancelEdit} className="flex-1">
                                Cancel
                            </Button>
                            <Button onClick={handleSaveClick} className="flex-1">
                                Save Changes
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}
