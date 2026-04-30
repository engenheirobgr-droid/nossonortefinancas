import React from 'react';
import { FIXED_INCOME_CATEGORIES } from '../domain/finance/portfolio.js';

export default function PricesModal({
    currentPrices,
    formatCurrency,
    isFetchingPrices,
    onChangePrice,
    onClose,
    onFetchPrices,
    onOpenAssetHistory,
    onSave,
    portfolio,
    Sparkles,
    TrendingUp,
    X,
    viewMode
}) {
    const assets = portfolio.filter((asset) => asset.qty > 0 || (FIXED_INCOME_CATEGORIES.includes(asset.category) && asset.pureBalance > 0));

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="glass-card w-full max-w-sm rounded-[2rem] p-6 shadow-2xl max-h-[80vh] flex flex-col">
                <div className="flex justify-between mb-6 border-b border-white/10 pb-4">
                    <h3 className="font-bold text-xl flex gap-2 text-white">
                        <TrendingUp className="text-indigo-400" /> Cotacoes Atuais
                    </h3>
                    <button onClick={onClose} className="bg-white/10 p-2 rounded-full text-white hover:bg-white/20 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <button
                    onClick={onFetchPrices}
                    disabled={isFetchingPrices}
                    className={`w-full mb-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border border-indigo-500/20 ${
                        isFetchingPrices ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 active:scale-95'
                    }`}
                >
                    {isFetchingPrices ? <Sparkles className="animate-spin" size={18} /> : <Sparkles size={18} />}
                    {isFetchingPrices ? 'Analisando Mercado...' : 'Buscar com IA'}
                </button>
                <p className="text-xs text-slate-400 mb-4">Informe o preco unitario atual de cada ativo para calcular a rentabilidade.</p>
                <div className="overflow-y-auto space-y-4 flex-1 custom-scrollbar">
                    {assets.map((asset) => {
                        const isFixed = FIXED_INCOME_CATEGORIES.includes(asset.category);
                        const priceKey = isFixed ? `${asset.name}@@${viewMode}` : asset.name;

                        return (
                            <div
                                key={asset.name}
                                className="flex gap-3 items-center justify-between cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-lg transition-colors border-b border-white/5 last:border-0"
                                onClick={() => onOpenAssetHistory(asset.name)}
                            >
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-slate-200">{asset.name}</p>
                                    <p className="text-xs text-slate-400">
                                        {isFixed ? `Custo Liquido: ${formatCurrency(asset.pureBalance)}` : `PM: ${formatCurrency(asset.avgPrice)}`}
                                    </p>
                                </div>
                                <div className="relative w-36">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] font-bold uppercase text-slate-500 mb-0.5">
                                            {isFixed ? 'Saldo Atual' : 'Preco Cota'}
                                        </span>
                                        <div className="relative w-full">
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">R$</span>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={currentPrices[priceKey] !== undefined ? currentPrices[priceKey] : (currentPrices[asset.name] || '')}
                                                onChange={(e) => onChangePrice(priceKey, e.target.value)}
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-full border-b border-white/10 pl-6 font-bold py-1 outline-none focus:border-indigo-500 text-right text-white bg-transparent"
                                                placeholder={asset.currentPrice || (isFixed ? asset.totalCost.toFixed(2) : '0.00')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {assets.length === 0 && <p className="text-center text-xs text-slate-500">Nenhum ativo disponivel para atualizacao.</p>}
                </div>
                <button onClick={onSave} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold mt-4 hover:bg-indigo-500 transition-colors">
                    Salvar Cotacoes
                </button>
            </div>
        </div>
    );
}
