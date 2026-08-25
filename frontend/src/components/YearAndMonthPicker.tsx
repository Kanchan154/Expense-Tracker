import React from 'react';

const monthList = [
    { value: "01", label: "Jan" },
    { value: "02", label: "Feb" },
    { value: "03", label: "Mar" },
    { value: "04", label: "Apr" },
    { value: "05", label: "May" },
    { value: "06", label: "Jun" },
    { value: "07", label: "Jul" },
    { value: "08", label: "Aug" },
    { value: "09", label: "Sep" },
    { value: "10", label: "Oct" },
    { value: "11", label: "Nov" },
    { value: "12", label: "Dec" },
]

interface YEARMONTHPICKERINTERFACE {
    month: string;
    year: number;
    setmonth: React.Dispatch<React.SetStateAction<string>>;
    setyear: React.Dispatch<React.SetStateAction<number>>;
    fetchTransactions: () => void;
}
const YearAndMonthPicker = ({
    month, setmonth, setyear, year, fetchTransactions
}: YEARMONTHPICKERINTERFACE) => {

    return (
        <div className='max-w-7xl mx-auto p-5 border-2 rounded-xl flex flex-col gap-5'>
            {/* Year */}
            <div className='flex items-center justify-center gap-10'>
                {/* minus button */}
                <button className='text-2xl font-bold rounded-xl px-5 py-2 bg-red-500 text-white' onClick={() => setyear(year - 1)}>-</button>
                {/* year */}
                <div className='text-2xl font-bold rounded-xl px-5 py-2 bg-yellow-500 '>{year}</div>
                {/* plus button */}
                <button className='text-2xl font-bold bg-green-500 text-white rounded-xl px-5 py-2' onClick={() => setyear(year + 1)}>+</button>
            </div>
            {/* Month */}
            <div className='flex items-center gap-4 overflow-x-auto scrollbar-none px-4 mx-auto max-w-full'>
                {monthList.map((monthItem) => (
                    <div
                        key={monthItem.value}
                        className={`text-base font-semibold ${month === monthItem.value && "bg-green-500 text-white"} border rounded-xl px-5 py-2 cursor-pointer hover:bg-green-300`}
                        onClick={() => setmonth(monthItem.value)}
                    >{monthItem.label}</div>
                ))}
            </div>
            {/* fetch button */}
            <button className='bg-emerald-500 py-2 shadow-xl shadow-emerald-100 rounded-full cursor-pointer'
                onClick={() => fetchTransactions()}
            >
                Fetch Transactions
            </button>
        </div>
    )
}

export default YearAndMonthPicker