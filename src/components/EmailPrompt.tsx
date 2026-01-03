import { useState } from "react"
import { supabase } from "../lib/supabaseClient"
import SadPathChart, { type HierarchicalChartData } from "./SadPathChart"

export default function EmailPrompt() {
    const [email, setEmail] = useState("")
    const [data, setData] = useState<HierarchicalChartData | null>(null)
    const [previousData, setPreviousData] = useState<HierarchicalChartData | null>(null)
    const [newValues, setNewValues] = useState("")
    const [loaded, setLoaded] = useState(false)
    const [showConfirmation, setShowConfirmation] = useState(false)
    const [pendingData, setPendingData] = useState<HierarchicalChartData | null>(null)

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

    const parseValuesToData = (values: string): HierarchicalChartData => {
        const parsedValues = values.split(",").map(v => parseInt(v.trim())).filter(v => !isNaN(v))
        
        if (parsedValues.length >= 2) {
            const languageValue = parsedValues[0] || 75
            const hostilityValue = parsedValues[1] || 25
            
            const outerValues = parsedValues.slice(2, 10)
            const defaultOuter = [20, 35, 20, 15, 10, 12, 10, 8]
            
            return {
                innerRing: [
                    { name: 'Language Issues', value: languageValue },
                    { name: 'Hostility Issues', value: hostilityValue },
                ],
                outerRing: [
                    { name: 'Assistant did not speak French', value: outerValues[0] || defaultOuter[0] },
                    { name: 'Unsupported Language', value: outerValues[1] || defaultOuter[1] },
                    { name: 'Assistant did not speak Spanish', value: outerValues[2] || defaultOuter[2] },
                    { name: 'Verbal Aggression', value: outerValues[3] || defaultOuter[3] },
                    { name: 'Customer Hostility', value: outerValues[4] || defaultOuter[4] },
                    { name: 'User refused to confirm identity', value: outerValues[5] || defaultOuter[5] },
                    { name: 'Caller Identification', value: outerValues[6] || defaultOuter[6] },
                    { name: 'Incorrect caller identity', value: outerValues[7] || defaultOuter[7] },
                ],
            }
        }
        
        return getDefaultData()
    }

    const loadData = async (email: string) => {
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
        } catch (error) {
            console.error('Error in loadData:', error)
            const defaultData = getDefaultData()
            setData(defaultData)
            setPreviousData(null)
        } finally {
            setLoaded(true)
        }
    }

    const handleSaveClick = () => {
        const newData = parseValuesToData(newValues)
        
        if (previousData) {
            setPendingData(newData)
            setShowConfirmation(true)
        } else {
            saveDataToSupabase(newData)
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
            setNewValues("")
            setShowConfirmation(false)
            setPendingData(null)
        } catch (error) {
            console.error('Error in saveDataToSupabase:', error)
            alert('Failed to save data. Please check your Supabase configuration.')
        }
    }

    const handleConfirmOverwrite = () => {
        if (pendingData) {
            saveDataToSupabase(pendingData)
        }
    }

    const handleCancelOverwrite = () => {
        setShowConfirmation(false)
        setPendingData(null)
    }

    return (
        <div className="mt-6 bg-white/5 rounded-2xl p-6">
            {!loaded ? (
                <div>
                    <h3 className="mb-2 text-white">Enter your email to load your data</h3>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="px-3 py-2 rounded bg-gray-900 border border-gray-700 w-full text-white placeholder-gray-500"
                    />
                    <button 
                        onClick={() => loadData(email)} 
                        className="mt-3 px-4 py-2 bg-accent rounded text-black font-semibold hover:opacity-90 transition-opacity"
                    >
                        Load
                    </button>
                </div>
            ) : (
                <>
                    <SadPathChart data={data || undefined} />
                    
                    {showConfirmation && previousData && pendingData && (
                        <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-700/50 rounded-lg">
                            <h4 className="text-yellow-400 font-semibold mb-3">Previous Values Detected</h4>
                            <div className="mb-4">
                                <p className="text-sm text-gray-300 mb-2">Your previous values:</p>
                                <div className="bg-gray-900/50 p-3 rounded text-sm">
                                    <div className="mb-2">
                                        <strong className="text-white">Inner Ring:</strong>
                                        <ul className="ml-4 mt-1 text-gray-300">
                                            {previousData.innerRing.map((item, idx) => (
                                                <li key={idx}>{item.name}: {item.value}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <strong className="text-white">Outer Ring:</strong>
                                        <ul className="ml-4 mt-1 text-gray-300">
                                            {previousData.outerRing.map((item, idx) => (
                                                <li key={idx}>{item.name}: {item.value}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <p className="text-sm text-gray-300 mb-2">New values you want to save:</p>
                                <div className="bg-gray-900/50 p-3 rounded text-sm">
                                    <div className="mb-2">
                                        <strong className="text-white">Inner Ring:</strong>
                                        <ul className="ml-4 mt-1 text-gray-300">
                                            {pendingData.innerRing.map((item, idx) => (
                                                <li key={idx}>{item.name}: {item.value}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <strong className="text-white">Outer Ring:</strong>
                                        <ul className="ml-4 mt-1 text-gray-300">
                                            {pendingData.outerRing.map((item, idx) => (
                                                <li key={idx}>{item.name}: {item.value}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-yellow-300 mb-4">Do you want to overwrite your previous values?</p>
                            <div className="flex gap-3">
                                <button 
                                    onClick={handleConfirmOverwrite}
                                    className="px-4 py-2 bg-accent rounded text-black font-semibold hover:opacity-90 transition-opacity"
                                >
                                    Yes, Overwrite
                                </button>
                                <button 
                                    onClick={handleCancelOverwrite}
                                    className="px-4 py-2 bg-gray-700 rounded text-white font-semibold hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="mt-4">
                        <p className="text-sm text-gray-300 mb-2">
                            Enter values (comma-separated). First 2 values for Inner Ring (Language Issues, Hostility Issues), 
                            next 8 values for Outer Ring details.
                        </p>
                        <p className="text-xs text-gray-500 mb-2">
                            Format: Language, Hostility, French, Unsupported, Spanish, Aggression, Hostility, Refused, ID, Incorrect ID
                        </p>
                        <input
                            value={newValues}
                            onChange={e => setNewValues(e.target.value)}
                            placeholder="e.g., 75, 25, 20, 35, 20, 15, 10, 12, 10, 8"
                            className="px-3 py-2 rounded bg-gray-900 border border-gray-700 w-full mt-2 text-white placeholder-gray-500"
                        />
                        <button 
                            onClick={handleSaveClick} 
                            className="mt-3 px-4 py-2 bg-accent rounded text-black font-semibold hover:opacity-90 transition-opacity"
                            disabled={showConfirmation}
                        >
                            Save Values
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
