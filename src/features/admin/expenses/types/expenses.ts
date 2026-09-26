export enum ExpenseType {
  REFRESHMENT = "REFRESHMENT",
  UTILITY = "UTILITY",
  MAINTENANCE = "MAINTENANCE",
  BRANCH = "BRANCH",
  LOGISTIC = "LOGISTIC",
}

export enum ExpensePaymentType {
  CASH = "CASH",
  ONLINE = "ONLINE",
}

export interface Expense {
  id: string;
  branchId: string;
  description: string;
  type: ExpenseType;
  paymentType: ExpensePaymentType;
  amount: number;
  givenBy: string;
}