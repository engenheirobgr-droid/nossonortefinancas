import React, { useEffect, useMemo, useState } from 'react';
import MarketView from './MarketView.jsx';

export default function ChoresView({
    APP_ID,
    Broom,
    Check,
    CheckSquare,
    MarketIcons,
    Plus,
    RefreshCw,
    ShoppingCart,
    Sun,
    Trash,
    chores,
    data,
    db,
    formatCurrency,
    onAdd,
    onDelete,
    onResetDaily,
    onRotateCycle,
    onToggle,
    shoppingList,
    userConfig,
    weekCycle
}) {
    const [mode, setMode] = useState('market');
    const [newChore, setNewChore] = useState('');
    const [newAssignee, setNewAssignee] = useState('bruno');
    const [newFreq, setNewFreq] = useState('weekly');
    const [isRotating, setIsRotating] = useState(true);
    const [newEffort, setNewEffort] = useState('medium');
    const [customPoints, setCustomPoints] = useState(20);
    const [points, setPoints] = useState({ bruno: 0, maiara: 0 });

    const EFFORT_LEVELS = {
        easy: { label: '😌 Sussa', points: 5, color: 'text-emerald-400' },
        medium: { label: '😐 Normal', points: 15, color: 'text-sky-400' },
        hard: { label: '😅 Cansativo', points: 30, color: 'text-amber-400' },
        heavy: { label: '🥵 Dói as Costas', points: 50, color: 'text-rose-400 font-bold' }
    };

    useMemo(() => {
        const nextPoints = { bruno: 0, maiara: 0 };
        if (chores) {
            chores.forEach((chore) => {
                if (chore.done && nextPoints[chore.assignee] !== undefined) {
                    nextPoints[chore.assignee] += Number(chore.points || 0);
                }
            });
        }
        setPoints(nextPoints);
    }, [chores]);

    useEffect(() => {
        if (EFFORT_LEVELS[newEffort]) {
            setCustomPoints(EFFORT_LEVELS[newEffort].points);
        }
    }, [newEffort]);

    const handleAdd = () => {
        if (!newChore) return;
        onAdd({
            title: newChore,
            assignee: newAssignee,
            isRotating,
            frequency: newFreq,
            effort: newEffort,
            points: Number(customPoints),
            done: false
        });
        setNewChore('');
    };

    const visibleChores = chores.filter((chore) => {
        if (chore.frequency === 'biweekly') return (weekCycle || 0) % 2 === 0;
        return true;
    });

    const groups = {
        daily: visibleChores.filter((chore) => chore.frequency === 'daily'),
        weekly: visibleChores.filter((chore) => chore.frequency !== 'daily')
    };

    const renderChoreItem = (chore) => {
        const effortKey = chore.effort || (chore.points >= 50 ? 'heavy' : chore.points >= 30 ? 'hard' : chore.points >= 15 ? 'medium' : 'easy');
        const effortStyle = EFFORT_LEVELS[effortKey] || EFFORT_LEVELS.medium;

        return (
            <div key={chore.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${chore.done ? 'bg-slate-800/30 border-white/5 opacity-60' : 'bg-slate-800/40 border-slate-600'}`}>
                <button onClick={() => onToggle(chore.id)} className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${chore.done ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500'}`}>
                    {chore.done && <Check size={14} className="text-white" />}
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <p className={`font-bold text-sm text-white truncate pr-2 ${chore.done ? 'line-through text-slate-500' : ''}`}>{chore.title}</p>
                        <div className="flex gap-1 items-center">
                            <span className={`text-xs px-1.5 py-0.5 rounded bg-white/5 border border-white/10 ${effortStyle.color} whitespace-nowrap`}>
                                {effortStyle.label}
                            </span>
                            {chore.frequency === 'biweekly' && <span className="text-xs bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded font-bold uppercase border border-purple-500/30">Quinzenal</span>}
                        </div>
                    </div>
                    <div className="flex gap-2 items-center mt-1">
                        <div className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded font-bold text-white ${userConfig[chore.assignee]?.color || 'bg-gray-400'}`}>
                            {userConfig[chore.assignee]?.avatar} {userConfig[chore.assignee]?.name}
                        </div>
                        {chore.isRotating && <span className="text-xs text-indigo-400 flex items-center gap-0.5"><RefreshCw size={10} /></span>}
                        <span className="text-xs text-amber-500 font-bold">+{chore.points}pts</span>
                    </div>
                </div>

                <button onClick={() => onDelete(chore.id)} className="text-slate-500 hover:text-rose-500"><Trash size={16} /></button>
            </div>
        );
    };

    return (
        <div className="space-y-6 pb-24 animate-fade-in">
            <div className="flex justify-center mb-6">
                <div className="bg-slate-900/50 p-1 rounded-2xl border border-white/10 flex">
                    <button onClick={() => setMode('market')} className={`px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${mode === 'market' ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/30 border border-emerald-400/20' : 'text-slate-400 hover:bg-white/5'}`}>
                        <ShoppingCart size={16} /> Mercado
                    </button>
                    <button onClick={() => setMode('tasks')} className={`px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${mode === 'tasks' ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/20' : 'text-slate-400 hover:bg-white/5'}`}>
                        <CheckSquare size={16} /> Tarefas
                    </button>
                </div>
            </div>

            {mode === 'market' ? (
                <MarketView
                    APP_ID={APP_ID}
                    Check={MarketIcons.Check}
                    Plus={MarketIcons.Plus}
                    Search={MarketIcons.Search}
                    ShoppingCart={MarketIcons.ShoppingCart}
                    Target={MarketIcons.Target}
                    TrendingDown={MarketIcons.TrendingDown}
                    X={MarketIcons.X}
                    data={data}
                    db={db}
                    formatCurrency={formatCurrency}
                    shoppingList={shoppingList}
                />
            ) : (
                <>
                    <div className="glass-card p-5">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-white uppercase tracking-wider"><Sun className="text-amber-500" /> Rotina Diária</h3>
                            <button onClick={onResetDaily} className="text-xs font-bold text-slate-400 hover:text-indigo-400 flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg border border-white/5">
                                <RefreshCw size={10} /> Resetar Dia
                            </button>
                        </div>
                        <div className="space-y-3">{groups.daily.map(renderChoreItem)}{groups.daily.length === 0 && <p className="text-xs text-slate-500 text-center">Sem tarefas diárias.</p>}</div>
                    </div>

                    <div className="glass-card p-5 relative overflow-hidden">
                        {(weekCycle || 0) % 2 === 0 ? (
                            <div className="absolute top-0 right-0 bg-purple-500/20 text-purple-300 border-l border-b border-purple-500/30 text-xs font-bold px-3 py-1 rounded-bl-xl">
                                ✨ Semana da Faxina Pesada
                            </div>
                        ) : null}

                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white uppercase tracking-wider"><Broom className="text-indigo-400" /> Missões da Semana</h3>
                        <div className="space-y-3">{groups.weekly.map(renderChoreItem)}{groups.weekly.length === 0 && <p className="text-xs text-slate-500 text-center">Tudo limpo por aqui!</p>}</div>

                        <div className="mt-8 pt-6 border-t border-dashed border-white/10">
                            <div className="flex flex-col gap-3 mb-6 bg-slate-800/50 p-4 rounded-xl border border-white/5">
                                <input
                                    type="text"
                                    value={newChore}
                                    onChange={(event) => setNewChore(event.target.value)}
                                    placeholder="Nome da tarefa (Ex: Limpar Lajes)"
                                    className="bg-transparent font-bold text-sm outline-none w-full border-b border-white/10 pb-2 text-white placeholder-slate-500"
                                />

                                <div className="flex gap-2">
                                    <select value={newAssignee} onChange={(event) => setNewAssignee(event.target.value)} className="flex-1 text-xs font-bold bg-slate-900/50 text-slate-300 p-2 rounded-lg border border-white/10 outline-none">
                                        <option value="bruno">Bruno</option>
                                        <option value="maiara">Maiara</option>
                                    </select>
                                    <select value={newFreq} onChange={(event) => setNewFreq(event.target.value)} className="flex-1 text-xs font-bold bg-slate-900/50 text-slate-300 p-2 rounded-lg border border-white/10 outline-none">
                                        <option value="daily">Diária</option>
                                        <option value="weekly">Semanal</option>
                                        <option value="biweekly">Quinzenal</option>
                                    </select>
                                </div>

                                <div className="flex gap-2 items-center">
                                    <select value={newEffort} onChange={(event) => setNewEffort(event.target.value)} className="flex-1 text-xs font-bold bg-slate-900/50 text-slate-300 p-2 rounded-lg border border-white/10 outline-none">
                                        {Object.entries(EFFORT_LEVELS).map(([key, value]) => (
                                            <option key={key} value={key}>{value.label} ({value.points}pts)</option>
                                        ))}
                                    </select>

                                    <button onClick={() => setIsRotating(!isRotating)} className={`px-3 py-2 rounded-lg text-xs font-bold border transition-colors ${isRotating ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-white/5 text-slate-400 border-white/10'}`}>
                                        {isRotating ? '🔄 Revezar' : '🔒 Fixo'}
                                    </button>
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t border-white/10 mt-1">
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs font-bold text-slate-400">Pontos:</span>
                                        <input type="number" value={customPoints} onChange={(event) => setCustomPoints(event.target.value)} className="w-10 text-xs font-bold text-white bg-slate-900/50 border border-white/10 rounded px-1 text-center" />
                                    </div>
                                    <button onClick={handleAdd} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md active:scale-95 flex items-center gap-1 hover:bg-indigo-500">
                                        <Plus size={14} /> Criar
                                    </button>
                                </div>
                            </div>

                            <button onClick={onRotateCycle} className="w-full bg-slate-800 text-slate-300 border border-white/10 py-3 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2 hover:bg-slate-700">
                                <RefreshCw size={16} /> Encerrar Semana & Girar
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
