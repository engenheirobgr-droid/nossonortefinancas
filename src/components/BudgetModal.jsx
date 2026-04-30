import React from 'react';

export default function BudgetModal({
    budgetSearch,
    editBudgets,
    onBudgetSearchChange,
    onClose,
    onSave,
    onUpdateBudgetLimit,
    Search,
    Sparkles,
    Target,
    X
}) {
    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="glass-card w-full max-w-sm rounded-[2rem] p-6 shadow-2xl max-h-[80vh] flex flex-col">
                <div className="flex justify-between mb-2">
                    <h3 className="font-bold text-xl flex gap-2 text-white"><Target className="text-indigo-400" /> Definir metas</h3>
                    <button onClick={onClose} className="bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-colors"><X size={20} /></button>
                </div>

                <div className="mb-4 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input type="text" placeholder="Buscar categoria..." value={budgetSearch} onChange={(e) => onBudgetSearchChange(e.target.value)} className="w-full bg-slate-800/50 border border-white/10 pl-9 pr-3 py-2 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500/50 text-white placeholder-slate-600" />
                </div>

                <div className="overflow-y-auto space-y-4 flex-1 pr-2 custom-scrollbar">
                    {editBudgets
                        .filter((budget) => budget.displayName.toLowerCase().includes(budgetSearch.toLowerCase()))
                        .map((budget) => {
                            const isParent = budget.type === 'main';
                            const hasChildren = editBudgets.some((child) => child.parent === budget.category);

                            let displayVal = budget.limit;

                            if (isParent && hasChildren) {
                                displayVal = editBudgets
                                    .filter((child) => child.parent === budget.category)
                                    .reduce((sum, child) => sum + (Number(child.limit) || 0), 0);
                            }

                            return (
                                <div key={budget.category} className="flex gap-3 items-center">
                                    <span className="text-xl w-8 text-center">{budget.icon}</span>
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <p className={`text-xs font-bold uppercase truncate ${isParent ? 'text-indigo-400' : 'text-slate-400'}`}>{budget.displayName || budget.category}</p>
                                            {isParent && hasChildren && <span className="text-xs text-indigo-300 font-bold bg-indigo-500/20 px-1.5 rounded flex items-center gap-1 border border-indigo-500/30">Auto <Sparkles size={8} /></span>}
                                        </div>
                                        <input
                                            type="number"
                                            value={displayVal}
                                            readOnly={isParent && hasChildren}
                                            onChange={(e) => {
                                                if (isParent && hasChildren) return;
                                                onUpdateBudgetLimit(budget.category, e.target.value);
                                            }}
                                            className={`w-full border-b font-bold py-1 outline-none focus:border-indigo-500 transition-colors bg-transparent ${isParent && hasChildren ? 'border-dashed border-white/10 text-slate-500 cursor-not-allowed pl-2 rounded' : 'border-white/10 text-white'}`}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                </div>
                <button onClick={onSave} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold mt-4 hover:bg-indigo-500 transition-colors">Salvar Alteracoes</button>
            </div>
        </div>
    );
}
