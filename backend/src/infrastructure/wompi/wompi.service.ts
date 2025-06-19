import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';

import { IWompiService } from '../../domain/ports/wompi.service.interface';
import { PaymentRequestDto } from '../payment/dto/payment-request.dto';

@Injectable()
export class WompiService implements IWompiService {
    private readonly baseUrl = process.env.WOMPI_SANDBOX_URL;
    private readonly publicKey = process.env.WOMPI_PUBLIC_KEY;

    async getAcceptanceToken(): Promise<{
        endUserPolicyToken: string;
        personalDataAuthToken: string;
    } | null> {
        try {
            const url = `${this.baseUrl}/merchants/${this.publicKey}`;
            const response = await axios.get(url);
            return {
                endUserPolicyToken: response.data?.data?.presigned_acceptance?.acceptance_token,
                personalDataAuthToken: response.data?.data?.presigned_acceptance?.personal_data_auth_token,
            };
        } catch (error) {
            console.error('[WompiService] Error getting acceptance token', error);
            return null;
        }
    }

    async tokenizeCard(dto: PaymentRequestDto): Promise<string | null> {
        try {
            const url = `${this.baseUrl}/tokens/cards`;
            const response = await axios.post(
                url,
                dto.card,
                {
                    headers: {
                        Authorization: `Bearer ${this.publicKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            return response.data?.data?.id ?? null;
        } catch (error) {
            console.error('[WompiService] Error tokenizing card', error);
            return null;
        }
    }

    async createTransaction(data: {
        acceptanceToken: string;
        personalDataAuthToken: string;
        cardToken: string;
        amountInCents: number;
        reference: string;
        email: string;
        installments: number;
    }): Promise<{ transactionId: string }> {
        const secret = process.env.WOMPI_INTEGRITY_SECRET;
        const url = `${this.baseUrl}/transactions`;

        const signatureString = `${data.reference}${data.amountInCents}COP${secret}`;
        const signature = crypto.createHash('sha256').update(signatureString).digest('hex');
        const response = await axios.post(
            url,
            {
                acceptance_token: data.acceptanceToken,
                accept_personal_auth: data.personalDataAuthToken,
                amount_in_cents: data.amountInCents,
                currency: 'COP',
                signature,
                customer_email: data.email,
                reference: data.reference,
                payment_method: {
                    type: 'CARD',
                    token: data.cardToken,
                    installments: data.installments,
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${this.publicKey}`,
                },
            },
        );

        return {
            transactionId: response.data.data.id,
        };
    }

    async getTransactionStatus(transactionId: string): Promise<string | null> {
        const url = `${this.baseUrl}/transactions/${transactionId}`;
        try {
            const { data } = await axios.get(url);
            return data.data.status;
        } catch (error) {
            console.error('Error obteniendo estado de transacción:', error.message);
            return null;
        }
    }
}
