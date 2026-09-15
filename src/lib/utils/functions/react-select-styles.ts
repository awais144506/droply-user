export const reactSelectClassNames = {
    control: (state: any) =>
        `flex min-h-10 w-full items-center justify-between rounded-xl bg-slate-50 border px-3 ${state.isFocused ? 'border-sky-500 ring-2 ring-sky-500/20' : 'border-slate-200'
        } shadow-none hover:border-sky-500 hover:bg-white transition-colors text-sm cursor-pointer`,
    valueContainer: () => "flex items-center gap-1 w-full m-0 p-0",
    singleValue: () => "text-slate-900 font-medium overflow-hidden text-ellipsis whitespace-nowrap",
    input: () => "text-slate-900 m-0 p-0",
    placeholder: () => "text-slate-400 font-normal",
    indicatorsContainer: () => "flex items-center gap-1",
    clearIndicator: () => "text-slate-400 hover:text-rose-500 cursor-pointer",
    dropdownIndicator: () => "text-slate-400 hover:text-slate-600 cursor-pointer",
    indicatorSeparator: () => "hidden",
    menu: () => "rounded-xl border border-slate-200 bg-white shadow-lg mt-1 text-sm overflow-hidden z-50",
    menuList: () => "max-h-48 custom-scrollbar p-1",
    option: (state: any) =>
        `cursor-pointer px-3 py-2 rounded-lg transition-colors ${state.isSelected ? 'bg-sky-50 text-sky-700 font-bold' : state.isFocused ? 'bg-slate-50 text-slate-900' : 'text-slate-700'
        }`,
};
