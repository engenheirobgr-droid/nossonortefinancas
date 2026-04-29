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
