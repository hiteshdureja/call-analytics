import CallDurationChart from "../components/CallDurationChart"
import EmailPrompt from "../components/EmailPrompt"

export default function Dashboard() {
    return (
        <div className="min-h-screen flex flex-col items-center p-8 gap-12 w-full relative overflow-hidden">
            <div className="absolute top-[-20%] left-[20%] w-[60%] h-[60%] bg-accent/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[20%] w-[60%] h-[60%] bg-highlight/10 rounded-full blur-[120px] pointer-events-none" />

            <h1 className="text-5xl font-bold !text-white tracking-tight animate-fade-in-up relative z-10 drop-shadow-2xl text-center mb-2">
                Voice Agent <span className="text-highlight">Analytics</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 animate-fade-in-up delay-100 relative z-10">Make your voice agents unbreakable.</p>
            <div className="w-full max-w-6xl space-y-10">
                <div className="animate-fade-in-up delay-100">
                    <CallDurationChart />
                </div>
                <div className="animate-fade-in-up delay-200">
                    <EmailPrompt />
                </div>
            </div>
        </div >
    )
}
