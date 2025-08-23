export default function LoggedInsights() {
    return (
        <div className="flex flex-col gap-4">
            <span className="font-bold">Other Logged Insights</span>
            <div className="flex flex-col gap-4 bg-[#F9D1CD] rounded-2xl p-4 w-full h-full">
                <div className="flex flex-col gap-2">
                    <span>Sleep Patterns</span>
                    <span className="font-semibold">Avg 7.2 hours per night</span>
                </div>
                <div className="flex flex-col gap-2">
                    <span>Activity Levels</span>
                    <span className="font-semibold">Highest during ovulation phase</span>
                </div>
                <div className="flex flex-col gap-2">
                    <span>Nutrition</span>
                    <span className="font-semibold">Cravings in peak luteal phase</span>
                </div>
                <div className="flex flex-col gap-2">
                    <span>Skin Changes</span>
                    <span className="font-semibold">Skin is clearest at follicular phase</span>
                </div>
                <div className="flex flex-col gap-2">
                    <span>Body Changes</span>
                    <span className="font-semibold">Bloating in menstural phase</span>
                </div>
                <div className="flex flex-col gap-2">
                    <span>Birth Control Log</span>
                    <span className="font-semibold">No missed pills</span>
                </div>
            </div>
        </div>
    )
}