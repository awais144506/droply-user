export interface BillingDocument {
    id: string;
    branchId: string;
    documentNumber: string;
    type: "QUOTATION" | "INVOICE";
    issueDate: string;
    customerId: string;
    partyName: string
    partyNtn: string
    partyStrn: string
    partyAddress: string
    partyPhone: string
    partyEmail: string
    subTotal: number;
    gstPercent: number;
    gstAmount: number;
    discount: number;
    totalAmount: number;
    advanceAmount: number;
    balanceDue: number;
    termsAndConditions: string;
    notes: string;
    createdAt: string;
    items: BillingDocumentItem[]
}

export interface BillingDocumentItem {
    id: string;
    billingDocumentId: string;
    productId: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    unitOfMeasure: string;
    amount: number;
}

export interface BillingDocumentApiResponse {
    quotations: BillingDocument[];
}