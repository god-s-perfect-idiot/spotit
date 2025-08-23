import { Info } from "lucide-react";

export default function Cycles() {
    return (
        <div className="flex flex-col gap-4">
            <span className="font-bold">My Cycles</span>
            <div className="flex flex-col gap-4 bg-[#F9D1CD] rounded-2xl p-4 w-full h-full">
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row justify-between">
                        <span className="text-sm">Previous Cycle Length</span>
                        <Info size={18} className="text-gray-500" />
                    </div>
                    <div className="flex flex-row justify-between">
                        <span>28 days</span>
                        <span>Normal</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row justify-between">
                        <span className="text-sm">Previous Period Length</span>
                        <Info size={18} className="text-gray-500" />
                    </div>
                    <div className="flex flex-row justify-between">
                        <span>6 days</span>
                        <span>Normal</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row justify-between">
                        <span className="text-sm">Cycle Length Variation</span>
                        <Info size={18} className="text-gray-500" />
                    </div>
                    <div className="flex flex-row justify-between">
                        <span>28-32 Days</span>
                        <span>Regular</span>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex flex-row justify-between">
                        <span className="text-sm">Average Period Length</span>
                        <Info size={18} className="text-gray-500" />
                    </div>
                    <div className="flex flex-row justify-between">
                        <span>6.5 Days</span>
                        <span>Normal</span>
                    </div>
                </div>
            </div>
        </div>
    )
}