import React from 'react'

type Props = {}

const DeficitRemarks = (props: Props) => {
    return (
        <div>     {deficit > 0 && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                    <p className="text-sm font-bold text-rose-700">Deficit: {deficit} Missing Container(s)</p>
                    <p className="text-[11px] text-rose-600 mt-0.5">Containers will be added to the customer&apos;s Khata unless a deposit is charged.</p>
                </div>
                <Button size="sm" className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] h-8 shrink-0 cursor-pointer shadow-sm">
                    Charge Deposit
                </Button>
            </div>
        )}

            <section>
                <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="h-4 w-4 text-slate-400" />
                    <label className="text-sm font-bold text-slate-900 uppercase tracking-wide">Transaction Remarks</label>
                </div>
                <Input
                    placeholder="e.g., Customer promised to return 2 empties tomorrow..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="h-10 bg-slate-50 border-slate-200 rounded-xl"
                />
            </section></div>
    )
}

export default DeficitRemarks