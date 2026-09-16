import React from 'react'
import GeneralMap from "@/lib/utils/components/GeneralMapDetails";
import { getDaysAgoText } from '@/lib/utils/functions/date-utils';

import {
    MapPin,
    CalendarClock,
} from "lucide-react";

type Props = {
    lastVisitDate?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    name: string;
}

const CustomerVisitMapDetails = ({ lastVisitDate, latitude, longitude, name }: Props) => {
    return (
        <div>
            <div className=" space-y-6">

                {/* Last Activity Card */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-emerald-600" />
                        Last Visit / Order
                    </h3>

                    {lastVisitDate ? (
                        <div>
                            <div className="flex items-end justify-between mb-1">
                                <span className="text-2xl font-black tracking-tight text-slate-900">
                                    {getDaysAgoText(lastVisitDate)}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500">
                                {new Intl.DateTimeFormat('en-US', {
                                    dateStyle: 'medium',
                                    timeStyle: 'short'
                                }).format(new Date(lastVisitDate))}
                            </p>
                        </div>
                    ) : (
                        <div className="text-slate-400 text-sm italic">
                            No previous visits recorded.
                        </div>
                    )}
                </div>

                {/* Location Map */}
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col min-h-100">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">Location</h3>
                        </div>
                    </div>

                    <div className="flex-1 rounded-xl overflow-hidden border border-slate-100 relative min-h-75">
                        {latitude && longitude ? (
                            <GeneralMap
                                lat={latitude}
                                lng={longitude}
                                popupText={name}
                                showCircle={false}
                            />
                        ) : (
                            <div className="h-full w-full absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-400 text-sm italic p-6 text-center">
                                <MapPin className="h-8 w-8 text-slate-300 mb-2" />
                                Coordinates not set. Update customer profile to view on map.
                            </div>
                        )}
                    </div>
                </div>

            </div></div>
    )
}

export default CustomerVisitMapDetails