import { Info, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/authSlice";

export default function Settings() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleLogout = async () => {
        try {
            await dispatch(logout()).unwrap();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

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
                <button
                    onClick={handleLogout}
                    className="flex flex-row gap-1 justify-between items-center p-2 rounded-lg hover:bg-red-100 transition-colors"
                >
                    <span className="font-semibold text-red-600">Logout</span>
                    <LogOut size={18} className="text-red-600" />
                </button>
            </div>
        </div>
    )
}