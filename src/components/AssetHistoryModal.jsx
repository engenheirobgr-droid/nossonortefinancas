import React from 'react';
import { buildAssetHistoryTimeline } from '../domain/finance/portfolio.js';

export default function AssetHistoryModal({
    assetName,
    Banknote,
    formatCurrency,
    Minus,
    onClose,
    PieChart,
    Plus,
    profile,
    transactions,
    viewMode,
    X
}) {
    const assetHistoryTxs = buildAssetHistoryTimeline(transactions, {
        assetName,
        viewMode,
        profile
    });

    return (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-slate-800 w-full max-w-md rounded-[2rem] p-6 shadow-2xl border border-white/10 flex flex-col max-h-[85vh] animate-slide-up">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10 shrink-0">
                    <div>
                        <h3 className="font-bold text-xl text-white flex items-center gap-2">
                            <PieChart className="text-indigo-400" />
                            {assetName}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">Historico de Movimentacoes</p>
                    </div>
                    <button onClick={onClose} className="bg-white/5 hover:bg-white/10 p-2 rounded-full text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="overflow-y-auto pr-2 space-y-4 custom-scrollbar flex-1 relative">
                    <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-white/5 rounded-full z-0"></div>

                    {assetHistoryTxs.map((t) => {
                        const isResgate = Number(t.quantity) < 0 && t.type === 'investment';
                        const isRendimento = t.category === 'Rendimentos/Dividendos' || t.type === 'income';
                        const isAporte = t.type === 'investment' && !isResgate && !isRendimento;

                        let icon = <Plus size={14} className="text-indigo-400" />;
                        let iconBg = 'bg-indigo-500/10 border-indigo-500/30';
                        let title = 'Aporte';
                        let valColor = 'text-indigo-400';

                        if (isResgate) {
                            icon = <Minus size={14} className="text-rose-400" />;
                            iconBg = 'bg-rose-500/10 border-rose-500/30';
                            title = 'Resgate';
                            valColor = 'text-rose-400';
                        } else if (isRendimento) {
                            icon = <Banknote size={14} className="text-emerald-400" />;
                            iconBg = 'bg-emerald-500/10 border-emerald-500/30';
                            title = 'Rendimento';
                            valColor = 'text-emerald-400';
                        }

                        return (
                            <div key={t.id} className="relative z-10 flex gap-4 pl-1">
                                <div className={`w-7 h-7 shrink-0 rounded-full border flex items-center justify-center mt-1 ${iconBg}`}>
                                    {icon}
                                </div>
                                <div className="flex-1 bg-white/5 rounded-xl p-3 border border-white/5">
                                    <div className="flex gap-2 justify-between items-start mb-1">
                                        <p className="text-sm font-bold text-slate-200">{title}</p>
                                        <div className="text-right flex-col items-end">
                                            <p className={`text-sm font-bold ${valColor}`}>
                                                {isResgate ? '-' : '+'}{formatCurrency(t.amount)}
                                            </p>
                                            {t.quantity && !isRendimento && (
                                                <div className="mt-1 flex flex-col items-end opacity-90">
                                                    <p className="text-[10px] text-slate-300 font-medium tracking-wide">Preco Cota: {formatCurrency(Math.abs(t.amount / t.quantity))}</p>
                                                    <p className="text-[10px] text-indigo-300 font-medium tracking-wide mt-0.5">PM: {formatCurrency(t.historicalPM)}</p>
                                                    {isResgate && (
                                                        <p className="text-[10px] text-amber-300 font-medium tracking-wide mt-0.5">Custo: {formatCurrency(t.transactionCost)}</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1 flex-wrap">
                                            <span>{new Date(t.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</span>
                                            {t.bank && (
                                                <span className="text-[9px] font-bold bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded-md border border-white/10">
                                                    {t.bank}
                                                </span>
                                            )}
                                        </p>
                                        {isAporte && Number(t.quantity) > 0 && (
                                            <p className="text-[10px] font-bold text-slate-300 px-2 py-0.5 bg-black/20 rounded-md">
                                                {t.quantity} cotas
                                            </p>
                                        )}
                                        {isResgate && Number(t.quantity) < 0 && (
                                            <p className="text-[10px] font-bold text-slate-300 px-2 py-0.5 bg-black/20 rounded-md">
                                                {Math.abs(Number(t.quantity))} cotas
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {assetHistoryTxs.length === 0 && (
                        <p className="text-center text-slate-500 text-sm mt-8">Nenhuma movimentacao encontrada para este ativo.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
