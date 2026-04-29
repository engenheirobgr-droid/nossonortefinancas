// Shared static data extracted from App.jsx during phase 4.
// --- DADOS ---
    export const USER_CONFIG = {
        bruno: { name: 'Bruno', avatar: '👨🏻‍💻', defaultPin: '1358', color: 'bg-indigo-600' },
        maiara: { name: 'Maiara', avatar: '👩🏻‍⚕️', defaultPin: '4321', color: 'bg-pink-600' },
    };

    export const BANKS = [
        { id: 'nubank', name: 'Nubank', color: 'bg-indigo-600' }, // Adjusted to Indigo for cleaner look
        { id: 'inter', name: 'Inter', color: 'bg-orange-500' },
        { id: 'itau', name: 'Itaú', color: 'bg-blue-600' },
        { id: 'bradesco', name: 'Bradesco', color: 'bg-rose-600' },
        { id: 'bb', name: 'BB', color: 'bg-yellow-500' },
        { id: 'santander', name: 'Santander', color: 'bg-rose-600' },
        { id: 'caixa', name: 'Caixa', color: 'bg-blue-500' },
        { id: 'btg', name: 'BTG', color: 'bg-blue-800' },
        { id: 'xp', name: 'XP', color: 'bg-slate-900' },
        { id: 'rico', name: 'Rico', color: 'bg-orange-600' },
        { id: 'clear', name: 'Clear', color: 'bg-blue-400' },
        { id: 'genial', name: 'Genial', color: 'bg-blue-700' },
        { id: 'c6', name: 'C6 Bank', color: 'bg-slate-800' },
        { id: 'nomad', name: 'Nomad', color: 'bg-yellow-400' },
        { id: 'wise', name: 'Wise', color: 'bg-lime-500' },
        { id: 'avenue', name: 'Avenue', color: 'bg-slate-900' },
        { id: 'money', name: 'Dinheiro', color: 'bg-emerald-600' },
        { id: 'vr', name: 'VR/VA', color: 'bg-pink-500' },
    ];

    export const INVESTMENT_TYPES = [
        { id: 'fixed', name: 'Renda Fixa (CDB/Tesouro)', icon: '🔒' },
        { id: 'stocks', name: 'Ações BR', icon: '🇧🇷' },
        { id: 'reits', name: 'FIIs', icon: '🏢' },
        { id: 'int_stocks', name: 'Ações EUA', icon: '🇺🇸' },
        { id: 'crypto', name: 'Cripto', icon: '₿' },
        { id: 'fund', name: 'Fundos', icon: '📈' },
        { id: 'reserve', name: 'Reserva Emergência', icon: '🆘' },
    ];

    export const CATEGORIES = {
        expense: [
            {
                id: 'home', name: 'Moradia', icon: '🏠', color: 'bg-violet-500/10 text-violet-300 border border-violet-500/20', barColor: 'bg-violet-500',
                subcategories: ['Aluguel', 'Condomínio', 'Internet/TV', 'Água', 'Luz', 'Gás', 'Mercado (Limpeza)', 'Mercado (Higiene)']
            },
            {
                id: 'food', name: 'Alimentação', icon: '🛒', color: 'bg-amber-500/10 text-amber-300 border border-amber-500/20', barColor: 'bg-amber-500',
                subcategories: ['Mercado (Comida)', 'Mercado (Água)', 'Feira', 'Padaria']
            },
            {
                id: 'transport', name: 'Transporte', icon: '🚗', color: 'bg-sky-500/10 text-sky-300 border border-sky-500/20', barColor: 'bg-sky-500',
                subcategories: ['Gasolina', 'Lavagem', 'Manutenção', 'Uber/99', 'Estacionamento', 'IPVA/Licenciamento']
            },
            {
                id: 'leisure', name: 'Lazer', icon: '🎉', color: 'bg-pink-500/10 text-pink-300 border border-pink-500/20', barColor: 'bg-pink-500',
                subcategories: ['Restaurante', 'Bebida', 'Bares e Festas', 'Confraternizações', 'Netflix/Streaming', 'Viagem', 'Outros']
            },
            {
                id: 'health', name: 'Saúde', icon: '💊', color: 'bg-rose-500/10 text-rose-300 border border-rose-500/20', barColor: 'bg-rose-500',
                subcategories: ['Academia', 'Consultas Médicas', 'Odonto', 'Exames', 'Remédios', 'Terapia']
            },
            {
                id: 'education', name: 'Educação', icon: '📚', color: 'bg-teal-500/10 text-teal-300 border border-teal-500/20', barColor: 'bg-teal-500',
                subcategories: ['Curso', 'Faculdade', 'Livros', 'Material Escolar']
            },
            {
                id: 'shopping', name: 'Compras', icon: '🛍️', color: 'bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20', barColor: 'bg-fuchsia-500',
                subcategories: ['Roupas', 'Eletrônicos', 'Casa', 'Presentes']
            },
            {
                id: 'adjustment', name: 'Ajuste/Reembolso', icon: '💸', color: 'bg-slate-500/10 text-slate-300 border border-slate-500/20', barColor: 'bg-slate-500',
                subcategories: []
            },
            {
                id: 'other', name: 'Outros', icon: '📦', color: 'bg-gray-500/10 text-gray-300 border border-gray-500/20', barColor: 'bg-gray-500',
                subcategories: ['Telefone Celular', 'Corte Cabelo/Beleza', 'Contribuição Família', 'Cesta Básica/Doação', 'Ação Fim de Ano']
            },
        ],
        income: [
            { id: 'salary', name: 'Salário', icon: '💰', color: 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20', subcategories: ['Adiantamento', 'Mensal', '13º Salário', 'Férias'] },
            { id: 'freelance', name: 'Freelance', icon: '💻', color: 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20', subcategories: ['Projeto', 'Consultoria'] },
            { id: 'gift', name: 'Presente', icon: '🎁', color: 'bg-pink-500/10 text-pink-300 border border-pink-500/20', subcategories: [] },
            { id: 'dividends', name: 'Dividendos', icon: '💵', color: 'bg-amber-500/10 text-amber-300 border border-amber-500/20', subcategories: [] },
            { id: 'adjustment', name: 'Reembolso Recebido', icon: '💸', color: 'bg-slate-500/10 text-slate-300 border border-slate-500/20', subcategories: [] },
        ],
        investment: INVESTMENT_TYPES.map(t => ({
            ...t,
            color: 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20',
            barColor: 'bg-indigo-500',
            subcategories: t.id === 'reserve' ? ['Caixinha', 'Poupança'] :
                t.id === 'fixed' ? ['CDB', 'Tesouro Direto', 'LCI/LCA'] :
                    t.id === 'stocks' ? ['Varejo', 'Bancos', 'Elétricas', 'Commodities'] :
                        t.id === 'reits' ? ['Papel', 'Tijolo', 'Fiagro'] : []
        })),
    };

    // --- CATEGORIA P2P (separada, não entra nos spreads de gráficos/orçamentos) ---
    export const P2P_CATEGORY = {
        id: 'loan',
        name: 'Empréstimo/Acerto',
        icon: '💸',
        color: 'bg-slate-500/10 text-slate-300',
        barColor: 'bg-slate-500'
    };

    export const DEFAULT_BUDGETS = {
        personal: [
            { category: 'Alimentação', limit: 600 },
            { category: 'Transporte', limit: 400 },
            { category: 'Lazer', limit: 500 },
        ],
        joint: [
            { category: 'Alimentação', limit: 1500 },
            { category: 'Moradia', limit: 2500 },
            { category: 'Lazer', limit: 800 },
        ],
    };

    // --- NOVA LISTA PADRÃO DE TAREFAS ---
    export const DEFAULT_CHORES = [
        // DIÁRIAS (Todo dia aparecem)
        { id: 'dishes', title: 'Lavar a Louça', assignee: 'bruno', isRotating: true, points: 5, done: false, frequency: 'daily' },
        { id: 'trash', title: 'Tirar o Lixo', assignee: 'bruno', isRotating: false, points: 5, done: false, frequency: 'daily' },

        // SEMANAIS (Fixo da semana)
        { id: 'bath', title: 'Lavar Banheiros', assignee: 'bruno', isRotating: true, points: 30, done: false, frequency: 'weekly' },
        { id: 'floor', title: 'Aspirar e Passar Pano', assignee: 'maiara', isRotating: true, points: 40, done: false, frequency: 'weekly' },
        { id: 'clothes', title: 'Lavar/Estender Roupa', assignee: 'maiara', isRotating: true, points: 20, done: false, frequency: 'weekly' },

        // QUINZENAIS (Aparecem semana sim, semana não)
        { id: 'fridge', title: 'Limpar Geladeira', assignee: 'maiara', isRotating: true, points: 50, done: false, frequency: 'biweekly' },
        { id: 'windows', title: 'Limpar Vidros/Janelas', assignee: 'bruno', isRotating: true, points: 45, done: false, frequency: 'biweekly' }
    ];


