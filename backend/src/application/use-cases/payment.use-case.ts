import { Inject, Injectable } from '@nestjs/common';
import { IWompiService } from '../../domain/ports/wompi.service.interface';
import { PaymentRequestDto } from '../../infrastructure/payment/dto/payment-request.dto';
import { v4 as uuidv4 } from 'uuid';

type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

@Injectable()
export class PaymentUseCase {
    constructor(
        @Inject('IWompiService')
        private readonly wompiService: IWompiService,
    ) { }

    async execute(dto: PaymentRequestDto): Promise<
        Result<
            { status: string },
            { step: 'ACCEPTANCE_TOKEN' | 'CARD_TOKENIZATION' | 'TRANSACTION'; message: string }
        >
    > {
        try {
            // Paso 1: Obtener acceptance tokens
            const tokens = await this.wompiService.getAcceptanceToken();
            if (!tokens) {
                return {
                    ok: false,
                    error: { step: 'ACCEPTANCE_TOKEN', message: 'Error obteniendo acceptance token' },
                };
            }

            // Paso 2: Tokenizar la tarjeta
            const cardToken = await this.wompiService.tokenizeCard(dto);
            if (!cardToken) {
                return {
                    ok: false,
                    error: { step: 'CARD_TOKENIZATION', message: 'Error tokenizando la tarjeta' },
                };
            }

            // Paso 3: Crear la transacción
            const reference = uuidv4();
            const amountInCents = dto.products.reduce((total, p) => {
                return total + (p.quantity * p.unitPrice) * 100000;
            }, 0);

            const transaction = await this.wompiService.createTransaction({
                acceptanceToken: tokens.endUserPolicyToken,
                personalDataAuthToken: tokens.personalDataAuthToken,
                cardToken,
                amountInCents,
                reference,
                email: 'cliente@correo.com',
                installments: 1,
            });

            if (!transaction) {
                return {
                    ok: false,
                    error: { step: 'TRANSACTION', message: 'Error creando la transacción' },
                };
            }

            const maxRetries = 10;
            let currentRetry = 0;
            let status: string | null = 'PENDING';

            while (status === 'PENDING' && currentRetry < maxRetries) {
                console.log(`estatus: ${status}, reintento: ${currentRetry}`);
                await new Promise((resolve) => setTimeout(resolve, 2000));
                status = await this.wompiService.getTransactionStatus(transaction.transactionId);
                currentRetry++;
            }

            if (status !== 'APPROVED') {
                return {
                    ok: false,
                    error: {
                        step: 'TRANSACTION',
                        message: `La transacción no fue aprobada. Estado final: ${status}`,
                    },
                };
            }

            return {
                ok: true,
                value: {
                    status: status,
                },
            };
        } catch (error) {
            return {
                ok: false,
                error: { step: 'TRANSACTION', message: 'Error inesperado: ' + error.message },
            };
        }
    }
}
