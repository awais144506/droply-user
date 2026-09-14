/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapPin } from "lucide-react"
import GeneralMap from "@/lib/utils/general-map"
import { AssignedRidersCard } from "./assigned-riders-card"



const ZoneDetailMap = ({ zone }: any) => {
    return (
        <div><div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col h-full min-h-120 min-w-200">
                <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                        <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900">Coverage Area</h3>
                        <p className="text-xs text-slate-500">Center location and estimated service radius</p>
                    </div>
                </div>

                <div className="flex-1 rounded-xl overflow-hidden border border-slate-100">
                    {zone.latitude && zone.longitude ? (
                        <GeneralMap
                            lat={zone.latitude}
                            lng={zone.longitude}
                            popupText={zone.name}
                            showCircle={true}
                            circleRadius={1500}
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-slate-50 text-slate-400 text-sm italic">
                            Coordinates not set for this zone
                        </div>
                    )}
                </div>
            </div>

            <div className="lg:col-span-1 min-h-75">
                <AssignedRidersCard riders={zone.riders} />
            </div>
        </div>
        </div>
    )
}

export default ZoneDetailMap