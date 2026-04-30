import assert from 'node:assert/strict';
import {
  buildAssetHistoryTimeline,
  buildDetailedPortfolio,
  calculatePortfolioTotal,
  getScopedPrice,
  sortInvestmentsChronologically
} from '../src/domain/finance/portfolio.js';

{
  const sorted = sortInvestmentsChronologically([
    { id: 'sell', date: '2026-01-10', quantity: -2 },
    { id: 'buy', date: '2026-01-10', quantity: 5 },
    { id: 'older', date: '2026-01-01', quantity: 1 }
  ]);

  assert.deepEqual(sorted.map(transaction => transaction.id), ['older', 'buy', 'sell']);
}

{
  const investments = [
    { date: '2026-01-01', type: 'investment', market: 'ABCD4', category: 'Ações BR', amount: 1000, quantity: 10 },
    { date: '2026-01-15', type: 'investment', market: 'ABCD4', category: 'Ações BR', amount: 600, quantity: 5 },
    { date: '2026-01-20', type: 'investment', market: 'ABCD4', category: 'Ações BR', amount: 330, quantity: -3 }
  ];

  assert.equal(calculatePortfolioTotal(investments, {
    currentPrices: { ABCD4: 120 },
    viewMode: 'personal'
  }), 1440);
}

{
  const investments = [
    { date: '2026-01-01', type: 'investment', market: 'ABCD4', category: 'Ações BR', amount: 1000, quantity: 10 },
    { date: '2026-01-20', type: 'investment', market: 'ABCD4', category: 'Ações BR', amount: 300, quantity: -3 }
  ];

  assert.equal(calculatePortfolioTotal(investments, {
    currentPrices: {},
    viewMode: 'personal'
  }), 700);
}

{
  const investments = [
    { date: '2026-01-01', type: 'investment', market: 'CDB XP', category: 'Renda Fixa (CDB/Tesouro)', amount: 1000, quantity: 1 },
    { date: '2026-01-20', type: 'investment', market: 'CDB XP', category: 'Renda Fixa (CDB/Tesouro)', amount: 200, quantity: -1 }
  ];

  // Current legacy historical helper zeroes fixed income when quantity reaches zero
  // unless a scoped manual current price is present.
  assert.equal(calculatePortfolioTotal(investments, {
    currentPrices: {},
    viewMode: 'personal'
  }), 0);

  assert.equal(calculatePortfolioTotal(investments, {
    currentPrices: { 'CDB XP@@personal': 850, 'CDB XP': 999 },
    viewMode: 'personal'
  }), 850);

  assert.equal(getScopedPrice(
    { 'CDB XP@@joint': 900, 'CDB XP': 850 },
    'CDB XP',
    'Renda Fixa (CDB/Tesouro)',
    'joint'
  ), 900);
}

{
  const investments = [
    { date: '2026-01-01', type: 'investment', market: 'ABCD4', category: 'Ações BR', amount: 1000, quantity: 10, bank: 'XP' },
    { date: '2026-01-02', type: 'investment', market: 'ABCD4', category: 'Ações BR', amount: 600, quantity: 5, bank: 'Nubank' },
    { date: '2026-01-03', type: 'investment', market: 'ABCD4', category: 'Ações BR', amount: 330, quantity: -3, bank: 'XP' },
    { date: '2026-01-04', type: 'investment', market: 'CDB XP', category: 'Renda Fixa (CDB/Tesouro)', amount: 1000, quantity: 1, bank: 'XP' },
    { date: '2026-01-05', type: 'investment', market: 'CDB XP', category: 'Renda Fixa (CDB/Tesouro)', amount: 1200, quantity: -1, bank: 'XP' }
  ];

  const detailed = buildDetailedPortfolio(investments, {
    currentPrices: { ABCD4: 120, 'CDB XP@@personal': 950 },
    viewMode: 'personal',
    dividendsByAsset: { ABCD4: 42 }
  });

  assert.equal(detailed.portfolioCurrentTotal, 2390);
  assert.equal(detailed.totalInvested, 1280);
  assert.equal(detailed.totalRealizedProfit, 200);

  const stock = detailed.portfolioMap.ABCD4;
  assert.equal(stock.qty, 12);
  assert.equal(Number(stock.avgPrice.toFixed(2)), 106.67);
  assert.equal(stock.currentTotal, 1440);
  assert.equal(stock.dividends, 42);
  assert.equal(stock.bankShares.XP, 7);
  assert.equal(stock.bankShares.Nubank, 5);

  const fixedIncome = detailed.portfolioMap['CDB XP'];
  assert.equal(fixedIncome.currentTotal, 950);
  assert.equal(fixedIncome.realizedProfit, 200);
  assert.equal(fixedIncome.pureBalance, 0);

  assert.equal(Number(detailed.investBankFlow.XP.toFixed(2)), 840);
  assert.equal(Number(detailed.investBankFlow.Nubank.toFixed(2)), 600);
  assert.equal(detailed.investCatMap['Ações BR'], 1440);
  assert.equal(detailed.investCatMap['Renda Fixa (CDB/Tesouro)'], 950);
}

{
  const timeline = buildAssetHistoryTimeline([
    { id: 'shared', date: '2026-01-01', type: 'investment', market: 'ABCD4', category: 'AÃ§Ãµes BR', amount: 999, quantity: 9, isShared: true, ownerId: 'bruno' },
    { id: 'buy-1', date: '2026-01-10', type: 'investment', market: 'ABCD4', category: 'AÃ§Ãµes BR', amount: 1000, quantity: 10, bank: 'XP', isShared: false, ownerId: 'bruno' },
    { id: 'dividend', date: '2026-01-12', type: 'income', market: 'ABCD4', category: 'Rendimentos/Dividendos', amount: 50, isShared: false, ownerId: 'bruno' },
    { id: 'buy-2', date: '2026-01-15', type: 'investment', market: 'ABCD4', category: 'AÃ§Ãµes BR', amount: 600, quantity: 5, bank: 'Nubank', isShared: false, ownerId: 'bruno' },
    { id: 'sell', date: '2026-01-20', type: 'investment', market: 'ABCD4', category: 'AÃ§Ãµes BR', amount: 330, quantity: -3, bank: 'XP', isShared: false, ownerId: 'bruno' },
    { id: 'other-asset', date: '2026-01-21', type: 'investment', market: 'EFGH3', category: 'AÃ§Ãµes BR', amount: 100, quantity: 1, isShared: false, ownerId: 'bruno' }
  ], {
    assetName: 'ABCD4',
    viewMode: 'personal',
    profile: 'bruno'
  });

  assert.deepEqual(timeline.map(transaction => transaction.id), ['sell', 'buy-2', 'dividend', 'buy-1']);
  assert.equal(Number(timeline[0].historicalPM.toFixed(2)), 106.67);
  assert.equal(Number(timeline[0].transactionCost.toFixed(2)), 320);
  assert.equal(timeline[1].historicalPM, 106.66666666666667);
  assert.equal(timeline[2].historicalPM, 0);
  assert.equal(timeline[3].historicalPM, 100);
}

console.log('Portfolio unit tests passed.');
