import React from 'react';

export default function PlanningView({
    dashboardMode,
    data,
    formatCurrency,
    onEditDream,
    onOpenBudget,
    onOpenDreamModal,
    Plus,
    Settings,
    Sparkles,
    Target,
    viewMode
}) {
    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <div className="glass-card p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold flex gap-2 items-center text-lg text-white uppercase tracking-wider">
                        <Sparkles size={20} className="text-amber-500" />
                        {viewMode === 'joint' ? 'Nossos Sonhos' : 'Meus Sonhos'}
                    </h3>
                    <button onClick={onOpenDreamModal} className="bg-slate-800 border border-white/20 text-white p-2 rounded-full hover:bg-slate-700">
                        <Plus size={16} />
                    </button>
                </div>

                {data.dreamsProgress.length === 0 ? (
                    <p className="text-center text-slate-400 text-sm">Nenhum sonho cadastrado. Comece agora!</p>
                ) : (
                    <div className="space-y-4">
                        {data.dreamsProgress.map((dream) => (
                            <div
                                key={dream.id}
                                className={`relative pr-7 cursor-pointer group transition-colors rounded-xl p-2 ${dream.isCompleted ? 'bg-amber-500/10 border border-amber-500/30' : 'hover:bg-white/5'}`}
                                onClick={() => onEditDream(dream)}
                            >
                                <div className="flex justify-between items-end mb-1">
                                    <div>
                                        <span className={`mr-2 ${dream.isCompleted ? 'text-3xl' : 'text-2xl'}`}>{dream.emoji}</span>
                                        <span className="font-bold text-slate-200">{dream.title}</span>
                                    </div>
                                    <div className="text-right">
                                        {dream.isCompleted && <p className="text-xs font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full inline-block mb-0.5">Concluido</p>}
                                        <p className="text-xs text-slate-400">Meta: {formatCurrency(dream.targetAmount)}</p>
                                        <p className={`font-bold ${dream.isCompleted ? 'text-amber-400' : 'text-indigo-400'}`}>{formatCurrency(dream.currentAmount)}</p>
                                        <p className="text-xs text-slate-400 font-bold mt-0.5">{dream.pct.toFixed(0)}% concluido</p>
                                    </div>
                                </div>

                                <div className="h-4 bg-slate-700/50 rounded-full overflow-hidden relative">
                                    <div className={`h-full transition-all duration-1000 ${dream.isCompleted ? 'bg-gradient-to-r from-amber-400 to-yellow-300' : 'bg-gradient-to-r from-indigo-500 to-purple-500'}`} style={{ width: `${dream.pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="glass-card p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold flex gap-2 items-center text-lg text-white uppercase tracking-wider">
                        <Target size={20} className="text-indigo-400" />
                        Orcamento Mensal
                    </h3>
                    <button onClick={onOpenBudget} className="text-xs bg-indigo-500/10 text-indigo-400 px-3 py-1.5 rounded-lg font-bold flex gap-1 items-center hover:bg-indigo-500/20 transition-colors border border-indigo-500/20">
                        <Settings size={14} /> Configurar
                    </button>
                </div>

                {data.planning.length === 0 ? (
                    <p className="text-center text-slate-400 text-sm py-8">Nenhuma meta configurada.</p>
                ) : (
                    <div className="space-y-8">
                        {data.planning.filter((budget) => budget.type === 'in').length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase text-emerald-500 tracking-wider mb-2 border-b border-emerald-500/30 pb-1">Objetivos de Receita</h4>
                                {data.planning.filter((budget) => budget.type === 'in').map((budget, i) => (
                                    <div key={`in-${i}`}>
                                        <div className="flex justify-between mb-1 text-sm font-bold">
                                            <span className="flex gap-2 text-slate-200">{budget.icon} {budget.category}</span>
                                            <span className={budget.realized >= budget.limit ? 'text-emerald-400' : 'text-slate-400'}>
                                                {formatCurrency(budget.realized)} / {formatCurrency(budget.limit)}
                                            </span>
                                        </div>
                                        <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden relative">
                                            <div className={`h-full transition-all duration-500 rounded-full ${budget.pct >= 100 ? 'bg-emerald-500' : 'bg-emerald-400/70'}`} style={{ width: `${budget.pct}%` }} />
                                        </div>
                                        <p className="text-xs text-right mt-1 text-slate-400 font-bold">{budget.rawPct.toFixed(0)}% atingido</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {data.planning.filter((budget) => budget.type === 'out').length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase text-rose-500 tracking-wider mb-2 border-b border-rose-500/30 pb-1 mt-6">Limites de {dashboardMode === 'statement' ? 'Gastos' : 'Aportes'}</h4>
                                {data.planning.filter((budget) => budget.type === 'out').map((budget, i) => (
                                    <div key={`out-${i}`}>
                                        <div className="flex justify-between mb-1 text-sm font-bold">
                                            <span className="flex gap-2 text-slate-200">{budget.icon} {budget.category}</span>
                                            <span className={budget.realized > budget.limit ? 'text-rose-500' : 'text-slate-400'}>
                                                {formatCurrency(budget.realized)} / {formatCurrency(budget.limit)}
                                            </span>
                                        </div>
                                        <div className="h-3 bg-slate-700/50 rounded-full overflow-hidden">
                                            <div className={`h-full transition-all duration-500 rounded-full ${budget.pct > 100 ? 'bg-rose-500' : budget.pct > 80 ? 'bg-amber-400' : 'bg-blue-400'}`} style={{ width: `${budget.pct}%` }} />
                                        </div>
                                        <p className="text-xs text-right mt-1 text-slate-400 font-bold">{budget.rawPct.toFixed(0)}% consumido</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
