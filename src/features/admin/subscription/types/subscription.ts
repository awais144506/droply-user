export interface BankDetail {
  id: string;
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  qrCodeUrl: string;
  isActive: boolean;
}