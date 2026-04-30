import React, { useState } from 'react';

export default function SimpleHistoryChart({ data, mode, viewMode, formatCurrency }) {
    if (!data || data.length === 0) {
        return <div className="text-center text-slate-400 text-xs py-10">Sem histórico suficiente</div>;
    }

    const getBarValue = (entry) => {
        if (mode === 'investment') {
            return viewMode === 'joint' ? (entry.runningPatrimony || 0) : (entry.runningNetWorth || 0);
        }
        return entry.runningBalance || 0;
    };

    const values = data.map(getBarValue);
    const maxVal = Math.max(...values.map(value => Math.abs(value)), 100);
    const height = 120;
    const [hoveredIndex, setHoveredIndex] = useState(null);

    return (
        <div className="w-full overflow-visible relative">
            <div className="flex items-end justify-between min-w-full h-[160px] pt-10 pb-6 px-2 relative font-sans">
                {data.map((entry, index) => {
                    const value = getBarValue(entry);
                    const isNegative = value < 0;
                    const barHeight = maxVal ? (Math.abs(value) / maxVal) * height : 0;
                    const isHovered = hoveredIndex === index;
                    const barColor = isNegative
                        ? 'bg-indigo-600'
                        : (mode === 'statement' ? 'bg-emerald-500' : 'bg-blue-600');
                    const glowColor = isNegative
                        ? 'shadow-[0_0_15px_rgba(79,70,229,0.4)]'
                        : (mode === 'statement' ? 'shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'shadow-[0_0_15px_rgba(37,99,235,0.4)]');
                    const isFirst = index === 0;
                    const isLast = index === data.length - 1;
                    const tooltipAlignment = isFirst ? 'left-0 translate-x-[-10%]' : isLast ? 'right-0 translate-x-[10%]' : 'left-1/2 -translate-x-1/2';

                    return (
                        <div
                            key={index}
                            className="flex flex-col items-center gap-2 flex-1 min-w-[40px] relative group cursor-pointer"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            onClick={() => setHoveredIndex(isHovered ? null : index)}
                        >
                            <div className="h-[120px] flex items-end relative w-full justify-center">
                                <div
                                    style={{ height: `${Math.max(barHeight, 4)}px` }}
                                    className={`w-3 rounded-t-md transition-all duration-500 relative ${barColor} ${isHovered ? `scale-110 ${glowColor} brightness-110` : 'opacity-80'}`}
                                />
                            </div>

                            <span className={`text-[10px] font-bold uppercase transition-colors ${isHovered ? 'text-white' : 'text-slate-500'}`}>
                                {entry.month.split('-')[1]}
                            </span>

                            {isHovered && (
                                <>
                                    <div className={`absolute bottom-[140%] ${tooltipAlignment} bg-slate-900/95 border border-white/10 p-3 rounded-xl shadow-2xl z-50 w-48 backdrop-blur-md animate-fade-in pointer-events-none`}>
                                        <div className="text-center border-b border-white/10 pb-1 mb-2">
                                            <p className="text-xs font-bold text-slate-400 uppercase">{entry.month}</p>
                                        </div>

                                        {mode === 'statement' ? (
                                            <div className="space-y-1">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-slate-400">Saldo Atual do Mês:</span>
                                                    <span className={`font-bold ${entry.runningBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{formatCurrency(entry.runningBalance)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-[10px]">
                                                    <span className="text-slate-500">Entradas:</span>
                                                    <span className="text-emerald-400">+{formatCurrency(entry.income)}</span>
                                                </div>
                                                <div className="flex justify-between items-center text-[10px]">
                                                    <span className="text-slate-500">Saídas:</span>
                                                    <span className="text-rose-400">-{formatCurrency(entry.expense + (entry.invested || 0))}</span>
                                                </div>
                                                {entry.resg > 0 && (
                                                    <div className="flex justify-between items-center text-[10px]">
                                                        <span className="text-slate-500">Resgates:</span>
                                                        <span className="text-emerald-400">+{formatCurrency(entry.resg)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-1">
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-slate-400">{viewMode === 'joint' ? 'Saldo Total de Inv.:' : 'Patrimônio do Mês:'}</span>
                                                    <span className={`font-bold ${value >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{formatCurrency(value)}</span>
                                                </div>
                                                {viewMode !== 'joint' && (
                                                    <div className="flex justify-between items-center text-[10px]">
                                                        <span className="text-slate-500">Saldo de Investimento:</span>
                                                        <span className="text-slate-300">{formatCurrency(entry.runningPatrimony)}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between items-center text-[10px]">
                                                    <span className="text-slate-500">Aportes do Mês:</span>
                                                    <span className="text-indigo-400">+{formatCurrency(entry.invested)}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute bottom-[130%] left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-slate-900/95 z-50 pointer-events-none" />
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
