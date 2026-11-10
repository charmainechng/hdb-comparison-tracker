import { LoanAffordabilityInputs } from '../types';

export function calculateBSD(price: number): number {
  let bsd = 0;
  if (price <= 180000) {
    bsd = price * 0.01;
  } else if (price <= 360000) {
    bsd = 180000 * 0.01 + (price - 180000) * 0.02;
  } else if (price <= 1000000) {
    bsd = 180000 * 0.01 + 180000 * 0.02 + (price - 360000) * 0.03;
  } else if (price <= 1500000) {
    bsd = 180000 * 0.01 + 180000 * 0.02 + 640000 * 0.03 + (price - 1000000) * 0.04;
  } else {
    bsd =
      180000 * 0.01 +
      180000 * 0.02 +
      640000 * 0.03 +
      500000 * 0.04 +
      (price - 1500000) * 0.05;
  }
  return Math.round(bsd);
}

export function calculateCpfGrants(
  income: number,
  firstTimer: boolean,
  within4kmParents: boolean,
  flatType: string
): { ehg: number; familyGrant: number; phg: number; totalGrant: number } {
  if (!firstTimer) {
    // Second timers or non-first-timers can still get PHG if living within 4km of parents
    const phg = within4kmParents ? 20000 : 0;
    return { ehg: 0, familyGrant: 0, phg, totalGrant: phg };
  }

  // 1. Family Grant for Resale (First Timer Couples)
  let familyGrant = 0;
  if (income <= 14000) {
    if (flatType === '2 ROOM' || flatType === '3 ROOM' || flatType === '4 ROOM') {
      familyGrant = 80000;
    } else {
      familyGrant = 50000;
    }
  }

  // 2. Enhanced Housing Grant (EHG) (income ceiling $9,000)
  let ehg = 0;
  if (income <= 1500) ehg = 80000;
  else if (income <= 2000) ehg = 75000;
  else if (income <= 2500) ehg = 70000;
  else if (income <= 3000) ehg = 65000;
  else if (income <= 3500) ehg = 60000;
  else if (income <= 4000) ehg = 55000;
  else if (income <= 4500) ehg = 50000;
  else if (income <= 5000) ehg = 45000;
  else if (income <= 5500) ehg = 40000;
  else if (income <= 6000) ehg = 35000;
  else if (income <= 6500) ehg = 30000;
  else if (income <= 7000) ehg = 25000;
  else if (income <= 7500) ehg = 20000;
  else if (income <= 8000) ehg = 15000;
  else if (income <= 8500) ehg = 10000;
  else if (income <= 9000) ehg = 5000;

  // 3. Proximity Housing Grant (PHG)
  const phg = within4kmParents ? 30000 : 0;

  const totalGrant = familyGrant + ehg + phg;
  return { ehg, familyGrant, phg, totalGrant };
}

export function calculateMortgage(inputs: LoanAffordabilityInputs, flatType = '4 ROOM') {
  const { propertyPrice, householdIncome, buyerAge, loanType, firstTimer, within4kmParents } = inputs;

  const maxTenure = Math.min(25, Math.max(10, 65 - buyerAge));
  const interestRate = loanType === 'hdb' ? 0.026 : 0.031; // 2.6% HDB loan vs ~3.1% Bank loan
  const ltvRatio = loanType === 'hdb' ? 0.80 : 0.75; // 80% HDB vs 75% Bank

  const grants = calculateCpfGrants(householdIncome, firstTimer, within4kmParents, flatType);
  const netPurchasePrice = Math.max(0, propertyPrice - grants.totalGrant);

  const maxLoanAmount = propertyPrice * ltvRatio;
  const loanPrincipal = Math.min(maxLoanAmount, netPurchasePrice);

  const downpaymentTotal = propertyPrice - maxLoanAmount;
  const minCashDownpayment = loanType === 'bank' ? propertyPrice * 0.05 : 0;
  const cpfOrCashDownpayment = downpaymentTotal - minCashDownpayment;

  // Monthly mortgage calculation: M = P * [ r(1 + r)^n ] / [ (1 + r)^n – 1]
  const monthlyRate = interestRate / 12;
  const totalMonths = maxTenure * 12;

  let monthlyInstallment = 0;
  if (loanPrincipal > 0) {
    monthlyInstallment =
      (loanPrincipal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  // MSR check: 30% of gross household income
  const maxMSRLimit = householdIncome * 0.3;
  const isMsrCompliant = monthlyInstallment <= maxMSRLimit;
  const msrPercentage = householdIncome > 0 ? (monthlyInstallment / householdIncome) * 100 : 0;

  const bsd = calculateBSD(propertyPrice);

  return {
    loanPrincipal: Math.round(loanPrincipal),
    maxTenure,
    interestRate: (interestRate * 100).toFixed(1),
    monthlyInstallment: Math.round(monthlyInstallment),
    downpaymentTotal: Math.round(downpaymentTotal),
    minCashDownpayment: Math.round(minCashDownpayment),
    cpfOrCashDownpayment: Math.round(cpfOrCashDownpayment),
    bsd,
    grants,
    maxMSRLimit: Math.round(maxMSRLimit),
    isMsrCompliant,
    msrPercentage: msrPercentage.toFixed(1),
  };
}
