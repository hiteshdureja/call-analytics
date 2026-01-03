import CallDurationChart from "../components/CallDurationChart"
import EmailPrompt from "../components/EmailPrompt"

export default function Dashboard() {
    return (
        <div className="min-h-screen flex flex-col items-center p-6 gap-10">
            <h1 className="text-3xl font-bold text-accent">Voice Agent Analytics</h1>
            <div className="w-full max-w-3xl space-y-10">
                <CallDurationChart />
                <EmailPrompt />
            </div>
        </div>
    )
}
