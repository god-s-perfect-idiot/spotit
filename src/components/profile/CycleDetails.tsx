export default function CycleDetails() {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between">
                <span className="text-lg font-semibold">My Cycle Details</span>
                <button type="button" className="text-sm pr-2 text-gray-700">
                    Edit
                </button>
            </div>
            <div className="flex flex-col gap-4 bg-[#F9D1CD] rounded-2xl p-6 w-full">
                <div className="flex flex-row gap-2 w-full justify-between">
                    <span className="text-base font-medium">Cycle Length</span>
                    <span className="text-base font-medium">28 days</span>
                </div>
                <div className="flex flex-row gap-2 w-full justify-between">
                    <span className="text-base font-medium">Period Length</span>
                    <span className="text-base font-medium">5-7 days</span>
                </div>
                <div className="flex flex-row gap-2 w-full justify-between">
                    <span className="text-base font-medium">Are your periods regular?</span>
                    <span className="text-base font-medium">Yes</span>
                </div>
                <div className="flex flex-row gap-2 w-full justify-between">
                    <span className="text-base font-medium">Are you on birth control?</span>
                    <span className="text-base font-medium">Yes</span>
                </div>
                <div className="flex flex-row gap-2 w-full justify-between">
                    <span className="text-base font-medium">Birth Control Method</span>
                    <span className="text-base font-medium">Depo</span>
                </div>
                <div className="flex flex-row gap-2 w-full justify-between">
                    <span className="text-base font-medium">Any diagnosed health Conditions?</span>
                    <span className="text-base font-medium">Yes</span>
                </div>
            </div>
        </div>
    )
}