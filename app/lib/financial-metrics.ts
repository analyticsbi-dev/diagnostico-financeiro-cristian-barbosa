import type { Diagnostic } from "./diagnostics";

export const numeric = (value: number | null | undefined) => Number.isFinite(Number(value)) ? Number(value) : 0;
export const ratio = (value: number, base: number) => base > 0 ? value / base : null;

export function calculateFinancialMetrics(d: Diagnostic) {
  const revenue = numeric(d.dre_faturamento), taxes = numeric(d.dre_impostos), purchases = numeric(d.dre_compras);
  const payroll = numeric(d.dre_folha), admin = numeric(d.dre_despesas_adm), cash = numeric(d.ativo_caixa_bancos);
  const receivables = numeric(d.ativo_contas_receber), inventory = numeric(d.ativo_estoques), otherReceivables = numeric(d.ativo_outros_receber);
  const fixedAssets = numeric(d.ativo_imobilizado), suppliers = numeric(d.passivo_fornecedores), bankShort = numeric(d.passivo_bancos_curto);
  const overdueTaxes = numeric(d.passivo_impostos), otherLiabilities = numeric(d.passivo_outras_obrigacoes), bankLong = numeric(d.passivo_bancos_longo);
  const capital = numeric(d.passivo_capital_social), employees = numeric(d.funcionarios_qtd);
  const financialExpense = (bankShort + overdueTaxes + bankLong) * 0.015;
  const netRevenue = revenue - taxes, grossResult = netRevenue - purchases, operatingResult = grossResult - payroll - admin - financialExpense;
  const currentAssets = cash + receivables + inventory + otherReceivables, totalAssets = currentAssets + fixedAssets;
  const currentLiabilities = suppliers + bankShort + overdueTaxes + otherLiabilities, bankDebt = bankShort + bankLong;
  const totalLiabilities = currentLiabilities + bankLong;
  const balanceTaxesPayable = overdueTaxes + taxes, balanceAccountsPayable = admin, balancePayrollPayable = payroll;
  const balanceCurrentLiabilities = suppliers + bankShort + balanceTaxesPayable + balanceAccountsPayable + balancePayrollPayable + otherLiabilities;
  const workingCapital = currentAssets - balanceCurrentLiabilities;
  const balanceNonCurrentLiabilities = bankLong, accumulated = totalAssets - balanceCurrentLiabilities - balanceNonCurrentLiabilities - capital, equity = capital + accumulated;
  const balanceTotalLiabilities = balanceCurrentLiabilities + balanceNonCurrentLiabilities + equity;
  const dryAssets = cash + receivables + otherReceivables;
  return { revenue,taxes,purchases,payroll,admin,financialExpense,cash,receivables,inventory,otherReceivables,fixedAssets,suppliers,bankShort,overdueTaxes,otherLiabilities,bankLong,capital,employees,netRevenue,grossResult,operatingResult,currentAssets,totalAssets,currentLiabilities,bankDebt,totalLiabilities,workingCapital,dryAssets,balanceTaxesPayable,balanceAccountsPayable,balancePayrollPayable,balanceCurrentLiabilities,balanceNonCurrentLiabilities,balanceTotalLiabilities,accumulated,equity,
    grossMargin:ratio(grossResult,revenue),operatingMargin:ratio(operatingResult,revenue),coverageRatio:ratio(dryAssets,currentLiabilities),currentLiquidity:ratio(currentAssets,balanceCurrentLiabilities),dryLiquidity:ratio(dryAssets,balanceCurrentLiabilities),immediateLiquidity:ratio(cash,balanceCurrentLiabilities),debtToAssets:ratio(totalLiabilities,totalAssets),bankDebtToRevenue:ratio(bankDebt,revenue),bankShortShare:ratio(bankShort,bankDebt),bankLongShare:ratio(bankLong,bankDebt),revenuePerEmployee:employees>0?revenue/employees:null,resultPerEmployee:employees>0?operatingResult/employees:null,payrollPerEmployee:employees>0?payroll/employees:null,payrollWeight:ratio(payroll,revenue),adminWeight:ratio(admin,revenue),taxWeight:ratio(taxes,revenue),purchaseWeight:ratio(purchases,revenue) };
}
