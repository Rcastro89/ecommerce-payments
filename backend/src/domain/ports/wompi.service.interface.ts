import { PaymentRequestDto } from '../../infrastructure/payment/dto/payment-request.dto';

export interface IWompiService {
    getAcceptanceToken(): Promise<{
        endUserPolicyToken: string;
        personalDataAuthToken: string;
    } | null>;
    tokenizeCard(dto: PaymentRequestDto): Promise<string | null>;

    createTransaction(data: {
        acceptanceToken: string;
        personalDataAuthToken: string;
        cardToken: string;
        amountInCents: number;
        reference: string;
        email: string;
        installments: number;
    }): Promise<{ transactionId: string }>;

    getTransactionStatus(transactionId: string): Promise<string | null>;
}


