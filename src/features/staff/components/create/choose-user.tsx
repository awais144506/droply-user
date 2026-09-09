import { Bike, Briefcase } from "lucide-react"

type Props = {
    step: string;
   handleRoleSelect: (staffRole: "MANAGER" | "RIDER") => void;
}

const ChooseStaff = ({ step, handleRoleSelect }: Props) => {
    return (
        <div> {step === "SELECT_ROLE" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <button
                    onClick={() => handleRoleSelect("RIDER")}
                    className="flex flex-col items-center justify-center p-8 bg-white border-2 border-slate-100 rounded-3xl hover:border-sky-500 hover:bg-sky-50 hover:shadow-md transition-all group cursor-pointer text-left h-full"
                >
                    <div className="h-20 w-20 rounded-2xl bg-sky-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                        <Bike className="h-10 w-10 text-sky-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Dispatch Rider</h3>
                    <p className="text-sm text-slate-500 text-center mt-3 max-w-62.5">
                        Field staff for delivering inventory, managing customer khatas, and recovering returnable assets.
                    </p>
                </button>

                <button
                    onClick={() => handleRoleSelect("MANAGER")}
                    className="flex flex-col items-center justify-center p-8 bg-white border-2 border-slate-100 rounded-3xl hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-md transition-all group cursor-pointer text-left h-full"
                >
                    <div className="h-20 w-20 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                        <Briefcase className="h-10 w-10 text-indigo-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Branch Manager</h3>
                    <p className="text-sm text-slate-500 text-center mt-3 max-w-62.5">
                        Admin access to manage operations, view financial reporting, and handle physical cash flow.
                    </p>
                </button>
            </div>
        )}</div>
    )
}

export default ChooseStaff