import { useState } from "react"
import { supabase } from "../lib/supabaseClient"
import SadPathChart, { type HierarchicalChartData } from "./SadPathChart"

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`rounded-5xl bg-card shadow-xl border border-[#2C2C3F] ${className}`}>
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
        primary: "bg-gradient-to-r from-[#855CF1] to-[#6d44d6] text-white hover:brightness-110 shadow-lg shadow-purple-900/30 border-0",
        secondary: "bg-transparent text-white hover:bg-white/5 border border-white/20",
        danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20",
        ghost: "bg-transparent text-secondary hover:text-white"
    }

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-8 py-3 rounded-full font-bold tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
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
    <div className="w-full group">
        {label && <label className="block text-xs text-secondary group-focus-within:text-highlight transition-colors duration-200 mb-2 uppercase tracking-wider font-bold">{label}</label>}
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full bg-input border border-white/10 rounded-xl px-5 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all duration-200 hover:border-white/20 shadow-inner ${className}`}
        />
    </div>
)

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    newData
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    newData: HierarchicalChartData | null;
}) => {
    if (!isOpen || !newData) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card border border-[#2C2C3F] rounded-[40px] p-8 max-w-lg w-full shadow-2xl animate-in zoom-in-95 duration-200">
                <h3 className="text-2xl font-bold text-white mb-2">Overwrite Data?</h3>
                <p className="text-secondary mb-6">You are about to save new values. This action cannot be undone.</p>

                <div className="space-y-6 mb-8 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                    <div className="bg-primary rounded-3xl p-5 border border-[#2C2C3F]">
                        <h4 className="text-accent font-bold text-xs uppercase tracking-widest mb-3">New Inner Ring</h4>
                        <div className="space-y-2">
                            {newData.innerRing.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <span className="text-secondary">{item.name}</span>
                                    <span className="text-white font-mono font-bold">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-primary rounded-3xl p-5 border border-[#2C2C3F]">
                        <h4 className="text-highlight font-bold text-xs uppercase tracking-widest mb-3">New Outer Ring</h4>
                        <div className="space-y-2">
                            {newData.outerRing.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <span className="text-secondary">{item.name}</span>
                                    <span className="text-white font-mono font-bold">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
                    <Button variant="primary" onClick={onConfirm} className="flex-1">Confirm Save</Button>
                </div>
            </div>
        </div>
    )
}

export default function EmailPrompt() {
    const [email, setEmail] = useState("")
    const [data, setData] = useState<HierarchicalChartData | null>(null)
    const [previousData, setPreviousData] = useState<HierarchicalChartData | null>(null)
    const [loaded, setLoaded] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)

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
            setShowConfirmModal(true)
        } else {
            saveDataToSupabase(data)
        }
    }

    const confirmSave = () => {
        if (data) {
            saveDataToSupabase(data)
            setShowConfirmModal(false)
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
            <Card className="max-w-md w-full mx-auto mt-20 p-8">
                <div className="text-center mb-8">
                    <h3 className="text-3xl font-bold text-white mb-3">Welcome Back</h3>
                    <p className="text-secondary text-base">Enter your email to view your analytics dashboard</p>
                </div>
                <div className="space-y-6">
                    <Input
                        value={email}
                        onChange={setEmail}
                        label="Email Address"
                        type="email"
                        className="text-lg text-center"
                    />
                    <Button onClick={() => loadData(email)} className="w-full py-4 text-lg">
                        Load Dashboard
                    </Button>
                </div>
            </Card>
        )
    }

    return (
        <Card className="mt-6 p-8 relative">
            <div className="flex justify-between items-center mb-10 border-b border-[#2C2C3F] pb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        Call Reasons Analysis
                        {previousData && <span className="text-xs font-bold px-3 py-1 rounded-full bg-highlight/10 text-highlight border border-highlight/20 tracking-wide uppercase">Synced</span>}
                    </h2>
                    <p className="text-secondary mt-2">Breakdown of call failure reasons</p>
                </div>

                {!isEditing && (
                    <Button variant="secondary" onClick={() => setIsEditing(true)}>
                        Edit Data
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className={`${isEditing ? 'lg:col-span-2' : 'lg:col-span-3'} order-2 lg:order-1 transition-all duration-500 ${isEditing ? 'opacity-30 blur-sm pointer-events-none' : 'opacity-100'}`}>
                    <SadPathChart data={data || undefined} />
                </div>

                {isEditing && data && (
                    <div className="lg:col-span-1 order-1 lg:order-2 flex flex-col h-full animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="flex-1 space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar mb-6">
                            <div className="bg-[#1C1C28] rounded-3xl p-6 border border-[#2C2C3F]">
                                <h3 className="text-accent font-bold mb-4 text-xs uppercase tracking-widest">Inner Ring (Categories)</h3>
                                <div className="space-y-4">
                                    {data.innerRing.map((item, idx) => (
                                        <div key={idx} className="space-y-2">
                                            <span className="text-sm text-secondary font-medium pl-2">{item.name}</span>
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

                            <div className="bg-[#1C1C28] rounded-3xl p-6 border border-[#2C2C3F]">
                                <h3 className="text-highlight font-bold mb-4 text-xs uppercase tracking-widest">Outer Ring (Details)</h3>
                                <div className="space-y-4">
                                    {data.outerRing.map((item, idx) => (
                                        <div key={idx} className="space-y-2">
                                            <span className="text-sm text-secondary font-medium pl-2">{item.name}</span>
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

                        <div className="flex gap-4 pt-6 border-t border-[#2C2C3F]">
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

            <ConfirmationModal
                isOpen={showConfirmModal}
                onClose={() => setShowConfirmModal(false)}
                onConfirm={confirmSave}
                newData={data}
            />
        </Card>
    )
}
