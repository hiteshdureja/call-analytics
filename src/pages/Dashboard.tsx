import CallDurationChart from "../components/CallDurationChart"
import EmailPrompt from "../components/EmailPrompt"

export default function Dashboard() {
    return (
        <div className="min-h-screen flex flex-col items-center p-6 gap-10 w-full relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/30 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[100px] pointer-events-none" />

            <h1 className="text-3xl font-bold text-gray-900 animate-fade-in-up relative z-10">Voice Agent Analytics</h1>
            <div className="w-full max-w-4xl space-y-10">
                <div className="animate-fade-in-up delay-100">
                    <CallDurationChart />
                </div>
                <div className="animate-fade-in-up delay-200">
                    <EmailPrompt />
                </div>
            </div>
        </div>
    )
}
