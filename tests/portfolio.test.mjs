import assert from 'node:assert/strict';
import {
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

console.log('Portfolio unit tests passed.');
