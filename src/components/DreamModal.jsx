import React from 'react';

const DREAM_EMOJIS = ['\u2708\uFE0F', '\u{1F3E0}', '\u{1F697}', '\u{1F48D}', '\u{1F476}', '\u{1F393}', '\u{1F3D6}\uFE0F', '\u{1F4B0}', '\u{1F680}', '\u{1F4BB}'];

export default function DreamModal({
    dEmoji,
    dScope,
    dTarget,
    dTitle,
    editingDreamId,
    onClose,
    onDelete,
    onEmojiChange,
    onSave,
    onScopeChange,
    onTargetChange,
    onTitleChange,
    Sparkles,
    Trash2,
    X
}) {
    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="glass-card w-full max-w-sm rounded-[2rem] p-6 shadow-2xl animate-slide-up">
                <div className="flex justify-between mb-6">
                    <h3 className="font-bold text-xl flex gap-2 text-white">
                        <Sparkles className="text-amber-500" /> {editingDreamId ? 'Editar Sonho' : 'Novo Sonho'}
                    </h3>
                    <button onClick={onClose} className="bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="space-y-4">
                    <div className="flex bg-slate-800 p-1 rounded-xl border border-white/10">
                        <button onClick={() => onScopeChange('personal')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${dScope === 'personal' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>
                            Meu Sonho
                        </button>
                        <button onClick={() => onScopeChange('joint')} className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${dScope === 'joint' ? 'bg-pink-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>
                            Nosso Sonho
                        </button>
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase text-slate-400 ml-1">Nome do Sonho</label>
                        <input type="text" value={dTitle} onChange={(e) => onTitleChange(e.target.value)} placeholder={dScope === 'joint' ? 'Ex: Nossa Casa' : 'Ex: Viagem Solo'} className="w-full bg-slate-800/50 p-3 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500 mt-1 border border-white/10 text-white placeholder-slate-600" />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase text-slate-400 ml-1">Valor Alvo (Meta)</label>
                        <input type="number" value={dTarget} onChange={(e) => onTargetChange(e.target.value)} placeholder="Ex: 20000" className="w-full bg-slate-800/50 p-3 rounded-xl font-bold outline-none focus:ring-2 focus:ring-indigo-500 mt-1 border border-white/10 text-white placeholder-slate-600" />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase text-slate-400 ml-1">Icone</label>
                        <div className="flex flex-wrap gap-3 mt-2 max-w-full">
                            {DREAM_EMOJIS.map((emoji) => (
                                <button key={emoji} onClick={() => onEmojiChange(emoji)} className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${dEmoji === emoji ? 'bg-indigo-600 text-white shadow-lg scale-110' : 'bg-white/5 hover:bg-white/10'}`}>
                                    {emoji}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button onClick={onSave} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold mt-2 hover:bg-indigo-500 transition-colors">
                        {editingDreamId ? 'Salvar Alteracoes' : 'Criar Sonho'}
                    </button>

                    {editingDreamId && (
                        <button onClick={() => onDelete(editingDreamId)} className="w-full bg-transparent border border-rose-500/30 text-rose-400 py-3 rounded-xl font-bold hover:bg-rose-500/10 transition-colors flex items-center justify-center gap-2">
                            <Trash2 size={16} /> Excluir Sonho
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
