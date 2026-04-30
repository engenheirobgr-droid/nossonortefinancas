import React, { useMemo, useState } from 'react';

export default function MarketView({
    APP_ID,
    Check,
    Plus,
    Search,
    ShoppingCart,
    Target,
    TrendingDown,
    X,
    data,
    db,
    formatCurrency,
    shoppingList
}) {
    const [searchTerm, setSearchTerm] = useState('');

    const productIntelligence = useMemo(() => {
        const map = {};

        data.fullList.forEach((transaction) => {
            if (transaction.items && transaction.items.length > 0) {
                transaction.items.forEach((item) => {
                    const normalizedName = item.name.toLowerCase().trim();
                    if (!map[normalizedName]) map[normalizedName] = { name: item.name, history: [] };

                    const quantity = item.qty || 1;
                    const effectiveUnitPrice = item.unitPrice > 0 ? item.unitPrice : (item.value / quantity);

                    map[normalizedName].history.push({
                        unitPrice: effectiveUnitPrice,
                        market: transaction.market || transaction.title,
                        unit: item.unit || 'un'
                    });
                });
            }
        });

        return Object.values(map).map((product) => {
            product.history.sort((a, b) => a.unitPrice - b.unitPrice);

            const best = product.history[0];
            product.bestPrice = best.unitPrice;
            product.bestMarket = best.market;
            product.unit = best.unit;
            product.avgPrice = product.history.reduce((accumulator, entry) => accumulator + entry.unitPrice, 0) / product.history.length;

            return product;
        }).sort((a, b) => a.name.localeCompare(b.name));
    }, [data.fullList]);

    const filteredProducts = productIntelligence.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const addToCart = async (product) => {
        const userQuantityString = prompt(
            `Quantos ${product.unit || 'un'} de "${product.name}" deseja comprar?\n\nPreço Médio: ${formatCurrency(product.avgPrice)} /${product.unit || 'un'}\nMelhor local: ${product.bestMarket} (${formatCurrency(product.bestPrice)})`,
            '1'
        );

        if (userQuantityString === null) return;

        const finalQuantity = parseFloat(userQuantityString.replace(',', '.')) || 1;
        const estimatedTotal = finalQuantity * product.avgPrice;

        await db.collection('artifacts').doc(APP_ID).collection('public').doc('data').collection('shopping_list').add({
            name: product.name,
            plannedQty: finalQuantity,
            unit: product.unit || 'un',
            price: estimatedTotal,
            avgUnitTest: product.avgPrice,
            market: product.bestMarket || '?',
            checked: false,
            createdAt: new Date().toISOString()
        });

        setSearchTerm('');
    };

    const addManualItem = async () => {
        if (!searchTerm) return;

        let priceInput = prompt(`Qual o preço para "${searchTerm}"?`, '0.00');
        if (priceInput === null) return;
        priceInput = priceInput.replace(',', '.');

        const finalPrice = parseFloat(priceInput);
        if (isNaN(finalPrice)) {
            alert('Valor inválido');
            return;
        }

        await db.collection('artifacts').doc(APP_ID).collection('public').doc('data').collection('shopping_list').add({
            name: searchTerm,
            price: finalPrice,
            market: 'Manual 📝',
            checked: false,
            createdAt: new Date().toISOString()
        });

        setSearchTerm('');
    };

    const toggleCartItem = async (item) => {
        await db.collection('artifacts').doc(APP_ID).collection('public').doc('data').collection('shopping_list').doc(item.id).update({ checked: !item.checked });
    };

    const removeCartItem = async (id) => {
        await db.collection('artifacts').doc(APP_ID).collection('public').doc('data').collection('shopping_list').doc(id).delete();
    };

    const totalCart = (shoppingList || []).reduce((accumulator, item) => accumulator + (item.checked ? 0 : item.price), 0);

    return (
        <div className="space-y-6 pb-24">
            <div className="glass-card p-5">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white uppercase tracking-wider"><ShoppingCart className="text-indigo-400" /> Lista de Compras</h3>

                {(!shoppingList || shoppingList.length === 0) ? (
                    <p className="text-sm text-slate-400 text-center py-4">Sua lista está vazia.</p>
                ) : (
                    <div className="space-y-3">
                        {shoppingList.map((item) => (
                            <div key={item.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${item.checked ? 'bg-slate-800/30 border-white/5 opacity-50' : 'bg-slate-800/30 border-slate-600'}`}>
                                <button onClick={() => toggleCartItem(item)} className={`w-5 h-5 rounded border-2 flex items-center justify-center ${item.checked ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500'}`}>
                                    {item.checked && <Check size={12} className="text-white" />}
                                </button>
                                <div className="flex-1">
                                    <p className={`font-bold text-sm text-white ${item.checked ? 'line-through text-slate-500' : ''}`}>{item.name}</p>
                                    <div className="flex justify-between items-center pr-2 mt-0.5">
                                        <p className="text-xs text-indigo-300 font-bold">
                                            {item.plannedQty || 1} {item.unit} <span className="text-slate-400 font-normal">x {formatCurrency(item.price / (item.plannedQty || 1))} (méd)</span>
                                        </p>
                                        <p className="text-xs text-slate-400 flex items-center gap-1">
                                            <TrendingDown size={10} className="text-emerald-400" /> {item.market}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-sm text-indigo-300">{item.price > 0 ? formatCurrency(item.price) : '-'}</p>
                                    <button onClick={() => removeCartItem(item.id)}><X size={14} className="text-slate-500 hover:text-rose-400" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-xs font-bold uppercase text-slate-400">Estimativa</span>
                    <span className="text-xl font-bold text-white">{formatCurrency(totalCart)}</span>
                </div>
            </div>

            <div className="glass-card p-5">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-white uppercase tracking-wider"><Target className="text-emerald-400" /> Adicionar Item</h3>
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Digite o nome do produto..."
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        className="w-full bg-slate-800/50 pl-10 pr-4 py-3 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500/50 text-white placeholder-slate-500 border border-white/5"
                    />
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">
                    {searchTerm && (
                        <div onClick={addManualItem} className="flex items-center gap-3 p-3 bg-indigo-900/30 hover:bg-indigo-900/50 rounded-xl cursor-pointer border border-indigo-500/30 mb-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300">
                                <Plus size={16} />
                            </div>
                            <div>
                                <p className="font-bold text-sm text-indigo-200">Adicionar "{searchTerm}"</p>
                                <p className="text-xs text-indigo-400">Novo item na lista</p>
                            </div>
                        </div>
                    )}

                    {filteredProducts.slice(0, 10).map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl cursor-pointer group border border-transparent hover:border-white/5" onClick={() => addToCart(product)}>
                            <div className="flex-1 pr-3 overflow-hidden">
                                <p className="font-bold text-sm text-slate-200 truncate">{product.name}</p>
                                <p className="text-xs text-slate-400">
                                    Média: {formatCurrency(product.avgPrice)} {product.unit && product.unit !== 'un' ? `/${product.unit}` : ''}
                                </p>
                            </div>
                            <div className="text-right flex-shrink-0 min-w-[100px]">
                                <p className="font-bold text-sm text-emerald-400 leading-tight">
                                    {formatCurrency(product.bestPrice)}
                                    <span className="text-xs text-emerald-600 font-normal ml-0.5">
                                        {product.unit && product.unit !== 'un' ? `/${product.unit}` : ''}
                                    </span>
                                </p>
                                <p className="text-xs text-slate-500 truncate max-w-[120px] ml-auto block">{product.bestMarket || 'Sem local'}</p>
                            </div>
                            <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-500/20 p-1.5 rounded-lg">
                                <Plus size={14} className="text-emerald-400" />
                            </div>
                        </div>
                    ))}
                    {!searchTerm && filteredProducts.length === 0 && <p className="text-center text-xs text-slate-500 py-4">Comece a digitar para ver sugestões.</p>}
                </div>
            </div>
        </div>
    );
}
