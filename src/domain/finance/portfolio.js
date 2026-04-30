export const FIXED_INCOME_CATEGORIES = ['Renda Fixa (CDB/Tesouro)', 'Reserva Emergência'];

export function isFixedIncomeAsset(categoryOrName) {
  return FIXED_INCOME_CATEGORIES.includes(categoryOrName);
}

export function getAssetName(transaction) {
  return transaction.market || transaction.category || 'Outros';
}

export function getScopedPrice(currentPrices, assetName, category, viewMode) {
  const isFixed = isFixedIncomeAsset(category);
  const priceKey = isFixed ? `${assetName}@@${viewMode}` : assetName;

  return currentPrices[priceKey] !== undefined
    ? currentPrices[priceKey]
    : (currentPrices[assetName] || 0);
}

export function sortInvestmentsChronologically(investments) {
  return [...investments].sort((a, b) => {
    const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateDiff !== 0) return dateDiff;

    const quantityA = a.quantity ? Number(a.quantity) : 0;
    const quantityB = b.quantity ? Number(b.quantity) : 0;
    return quantityB - quantityA;
  });
}

export function calculatePortfolioTotal(investments, { currentPrices = {}, viewMode }) {
  const tempPortfolio = {};
  let total = 0;

  sortInvestmentsChronologically(investments).forEach(transaction => {
    const assetName = getAssetName(transaction);
    const isFixed = isFixedIncomeAsset(transaction.category);
    const currentPrice = getScopedPrice(currentPrices, assetName, transaction.category, viewMode);

    if (!tempPortfolio[assetName]) {
      tempPortfolio[assetName] = {
        qty: 0,
        totalCost: 0,
        pureBalance: 0,
        currentPrice,
        category: transaction.category,
        name: assetName
      };
    }

    const transactionQuantity = Number(transaction.quantity);
    const transactionAmount = Number(transaction.amount);

    if (transactionQuantity >= 0) {
      tempPortfolio[assetName].qty += transactionQuantity;
      tempPortfolio[assetName].totalCost += transactionAmount;
      tempPortfolio[assetName].pureBalance += transactionAmount;
    } else {
      const sellQuantity = Math.abs(transactionQuantity);

      if (isFixed) {
        tempPortfolio[assetName].qty -= sellQuantity;
        tempPortfolio[assetName].pureBalance -= transactionAmount;
        if (tempPortfolio[assetName].pureBalance < 0) tempPortfolio[assetName].pureBalance = 0;
      } else {
        const quantityToDeduct = Math.min(sellQuantity, tempPortfolio[assetName].qty);

        if (tempPortfolio[assetName].qty > 0) {
          const currentAveragePrice = tempPortfolio[assetName].totalCost / tempPortfolio[assetName].qty;
          tempPortfolio[assetName].qty -= quantityToDeduct;
          tempPortfolio[assetName].totalCost -= quantityToDeduct * currentAveragePrice;
          tempPortfolio[assetName].pureBalance -= quantityToDeduct * currentAveragePrice;
        } else {
          tempPortfolio[assetName].totalCost -= transactionAmount;
          tempPortfolio[assetName].pureBalance -= transactionAmount;
          if (tempPortfolio[assetName].totalCost < 0) tempPortfolio[assetName].totalCost = 0;
        }
      }

      if (tempPortfolio[assetName].qty <= 0.000001) {
        tempPortfolio[assetName].qty = 0;
        tempPortfolio[assetName].pureBalance = 0;
      }
    }
  });

  Object.values(tempPortfolio).forEach(asset => {
    const isFixed = isFixedIncomeAsset(asset.category || asset.name);

    if (isFixed) {
      total += asset.currentPrice > 0 ? Number(asset.currentPrice) : asset.pureBalance;
    } else if (asset.qty > 0) {
      const averagePrice = asset.totalCost / asset.qty;
      const price = asset.currentPrice > 0 ? Number(asset.currentPrice) : averagePrice;
      total += asset.qty * price;
    } else {
      total += asset.totalCost;
    }
  });

  return total;
}

export function buildDetailedPortfolio(
  investments,
  { currentPrices = {}, viewMode, dividendsByAsset = {} }
) {
  const portfolioMap = {};
  let portfolioCurrentTotal = 0;
  let totalInvested = 0;
  let totalRealizedProfit = 0;
  const investBankFlow = {};
  const investCatMap = {};

  sortInvestmentsChronologically(investments).forEach(transaction => {
    const assetName = getAssetName(transaction);
    const currentPrice = getScopedPrice(currentPrices, assetName, transaction.category, viewMode);

    if (!portfolioMap[assetName]) {
      portfolioMap[assetName] = {
        name: assetName,
        category: transaction.category,
        bank: transaction.bank,
        bankShares: {},
        bankCost: {},
        qty: 0,
        totalCost: 0,
        pureBalance: 0,
        avgPrice: 0,
        currentPrice,
        currentTotal: 0,
        realizedProfit: 0,
        dividends: dividendsByAsset[assetName] || 0
      };
    }

    const asset = portfolioMap[assetName];
    const transactionQuantity = Number(transaction.quantity);
    const transactionAmount = Number(transaction.amount);
    const isFixed = isFixedIncomeAsset(transaction.category);

    if (transactionQuantity >= 0) {
      asset.qty += transactionQuantity;
      asset.totalCost += transactionAmount;
      asset.pureBalance += transactionAmount;
    } else if (isFixed) {
      const sellQuantity = Math.abs(transactionQuantity);
      asset.qty -= sellQuantity;
      const fixedIncomeExcess = Math.max(0, transactionAmount - asset.pureBalance);
      asset.realizedProfit += fixedIncomeExcess;
      asset.pureBalance = Math.max(0, asset.pureBalance - transactionAmount);
    } else {
      const sellQuantity = Math.abs(transactionQuantity);
      const quantityToDeduct = Math.min(sellQuantity, asset.qty);

      if (asset.qty > 0) {
        const currentAveragePrice = asset.totalCost / asset.qty;
        asset.qty -= quantityToDeduct;
        asset.totalCost -= quantityToDeduct * currentAveragePrice;
        asset.pureBalance -= quantityToDeduct * currentAveragePrice;
      } else {
        asset.totalCost -= transactionAmount;
        asset.pureBalance -= transactionAmount;
        if (asset.totalCost < 0) asset.totalCost = 0;
      }
    }

    if (transaction.bank) {
      asset.bankShares[transaction.bank] = (asset.bankShares[transaction.bank] || 0) + transactionQuantity;
      asset.bankCost[transaction.bank] = (asset.bankCost[transaction.bank] || 0) + (transactionQuantity < 0 ? -transactionAmount : transactionAmount);
    }

    if (asset.qty <= 0.000001) {
      asset.qty = 0;
      if (!isFixed) {
        asset.totalCost = 0;
        asset.pureBalance = 0;
      }
    }
  });

  const portfolio = Object.values(portfolioMap);

  portfolio.forEach(asset => {
    const isFixed = isFixedIncomeAsset(asset.category);

    if (isFixed) {
      asset.currentTotal = asset.currentPrice > 0 ? Number(asset.currentPrice) : asset.pureBalance;
      asset.avgPrice = asset.totalCost;
    } else if (asset.qty > 0) {
      asset.avgPrice = asset.totalCost / asset.qty;
      const price = asset.currentPrice > 0 ? Number(asset.currentPrice) : asset.avgPrice;
      asset.currentTotal = asset.qty * price;
    } else {
      asset.currentTotal = asset.totalCost;
    }

    totalInvested += isFixed ? asset.pureBalance : asset.totalCost;
    totalRealizedProfit += asset.realizedProfit || 0;

    const assetMarketValue = asset.currentTotal || asset.pureBalance || asset.totalCost;
    const categoryName = asset.category || 'Outros';
    investCatMap[categoryName] = (investCatMap[categoryName] || 0) + assetMarketValue;

    const totalBankCost = Object.values(asset.bankCost || {}).reduce((accumulator, current) => accumulator + current, 0);
    Object.keys(asset.bankShares || {}).forEach(bank => {
      let proportion = 0;

      if (asset.qty > 0) {
        proportion = (asset.bankShares[bank] || 0) / asset.qty;
      } else if (totalBankCost > 0) {
        proportion = (asset.bankCost[bank] || 0) / totalBankCost;
      }

      if (proportion > 0) {
        investBankFlow[bank] = (investBankFlow[bank] || 0) + (proportion * assetMarketValue);
      }
    });

    portfolioCurrentTotal += asset.currentTotal;
  });

  return {
    portfolioMap,
    portfolio,
    portfolioCurrentTotal,
    totalInvested,
    totalRealizedProfit,
    investBankFlow,
    investCatMap
  };
}

export function buildAssetHistoryTimeline(
  transactions,
  { assetName, viewMode, profile }
) {
  let currentQty = 0;
  let totalCost = 0;

  const enrichedTransactions = sortInvestmentsChronologically(
    transactions.filter(transaction => {
      if (transaction.market !== assetName) return false;

      return viewMode === 'joint'
        ? transaction.isShared
        : (!transaction.isShared && transaction.ownerId === profile);
    })
  ).map(transaction => {
    let historicalPM = 0;
    let transactionCost = 0;
    const isIncome = transaction.category === 'Rendimentos/Dividendos';

    if (!isIncome && transaction.quantity) {
      const quantity = Number(transaction.quantity);
      const isWithdrawal = quantity < 0 || (
        transaction.type === 'investment' &&
        transaction.category === 'Resgate de Investimento'
      );

      if (!isWithdrawal) {
        currentQty += quantity;
        totalCost += Number(transaction.amount);
        historicalPM = currentQty > 0 ? totalCost / currentQty : 0;
      } else {
        historicalPM = currentQty > 0 ? totalCost / currentQty : 0;
        transactionCost = historicalPM * Math.abs(quantity);
        currentQty += quantity;
        totalCost -= Math.min(transactionCost, totalCost);

        if (currentQty <= 0) {
          currentQty = 0;
          totalCost = 0;
        }
      }
    }

    return { ...transaction, historicalPM, transactionCost };
  });

  return enrichedTransactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
