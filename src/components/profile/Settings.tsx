import { Info } from "lucide-react";

export default function Settings() {
    return (
        <div className="flex flex-col gap-4">
            <span className="text-lg font-semibold">Settings</span>
            <div className="flex flex-col gap-4 bg-[#F9D1CD] rounded-2xl p-4 w-full h-full">
                <div className="flex flex-row gap-1 justify-between">
                    <span className="font-semibold">Download Report</span>
                    <Info size={18} className="text-gray-500" />
                </div>
                <div className="flex flex-row gap-1 justify-between">
                    <span className="font-semibold">App Settings</span>
                    <Info size={18} className="text-gray-500" />
                </div>
                <div className="flex flex-row gap-1 justify-between">
                    <span className="font-semibold">Privacy Settings</span>
                    <Info size={18} className="text-gray-500" />
                </div>
            </div>
        </div>
    )
}