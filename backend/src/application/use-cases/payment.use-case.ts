import { Inject, Injectable } from '@nestjs/common';
import { IWompiService } from '../../domain/ports/wompi.service.interface';
import { PaymentRequestDto } from '../../infrastructure/payment/dto/payment-request.dto';
import { v4 as uuidv4 } from 'uuid';
import { ClientRepository } from '../../domain/client/client.repository';
import { Client } from '../../domain/client/client.entity';
import { TransactionRepository } from '../../domain/transaction/transaction.repository';
import { TransactionItemRepository } from '../../domain/transaction/transaction-item.repository';
import { TransactionItem } from '../../domain/transaction/transaction-item.entity';
import { DeliveryRepository } from '../../domain/delivery/delivery.repository';
import { Delivery } from '../../domain/delivery/delivery.entity';
import { ProductRepository } from '../../domain/product/product.repository';
import { Transaction } from '../../domain/transaction/transaction.entity';

type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

@Injectable()
export class PaymentUseCase {
    constructor(
        @Inject('IWompiService')
        private readonly wompiService: IWompiService,

        @Inject(ClientRepository)
        private readonly clientRepository: ClientRepository,

        @Inject(TransactionRepository)
        private readonly transactionRepository: TransactionRepository,

        @Inject(TransactionItemRepository)
        private readonly transactionItemRepository: TransactionItemRepository,

        @Inject(DeliveryRepository)
        private readonly deliveryRepository: DeliveryRepository,

        @Inject(ProductRepository)
        private readonly productRepository: ProductRepository,
    ) { }

    async execute(dto: PaymentRequestDto): Promise<
        Result<
            { status: string },
            { step: 'ACCEPTANCE_TOKEN' | 'CARD_TOKENIZATION' | 'TRANSACTION'; message: string }
        >
    > {
        try {
            const updateTransactionStatus = async (transactionObjetc: Transaction, status: string) => {
                await this.transactionRepository.updateStatus(transactionObjetc.id_transaction, status);
            }

            // Paso 1: Validar que el cliente exista
            const clientExists = await this.clientRepository.findById(Number(dto.customer.idClient));

            if (clientExists) {
                clientExists.full_name = dto.customer.fullName;
                clientExists.phone = dto.customer.phone;
                clientExists.email = dto.customer.email;

                await this.clientRepository.save(clientExists);
            } else {
                const newClient = new Client();
                newClient.id_client = Number(dto.customer.idClient);
                newClient.full_name = dto.customer.fullName;
                newClient.email = dto.customer.email;
                newClient.phone = dto.customer.phone;
                newClient.created_at = new Date();

                await this.clientRepository.save(newClient);
            }

            //Paso 2: Crear transacción pendiente
            const reference = uuidv4();
            const amountInCents = dto.products.reduce((total, p) => {
                return total + (p.quantity * p.unitPrice) * 100;
            }, 0);

            const transactionObjetc = await this.transactionRepository.createPendingTransaction(
                reference,
                Number(dto.customer.idClient),
                amountInCents
            );

            if (!transactionObjetc) {
                return {
                    ok: false,
                    error: { step: 'TRANSACTION', message: 'Error creando la transacción pendiente' },
                };
            }

            // Paso 3: Guardar los items de la transacción
            const items: TransactionItem[] = dto.products.map((p) => {
                const item = new TransactionItem();
                item.transaction = transactionObjetc;
                item.product = { idProduct: p.idProduct } as any;
                item.quantity = p.quantity;
                item.unit_price = p.unitPrice;
                return item;
            });

            await this.transactionItemRepository.save(items);

            // Paso 4: Obtener acceptance tokens
            const tokens = await this.wompiService.getAcceptanceToken();

            if (!tokens) {
                updateTransactionStatus(transactionObjetc, 'FAILED');
                return {
                    ok: false,
                    error: { step: 'ACCEPTANCE_TOKEN', message: 'Error obteniendo acceptance token' },
                };
            }

            // Paso 5: Tokenizar la tarjeta
            const cardToken = await this.wompiService.tokenizeCard(dto);
            if (!cardToken) {
                updateTransactionStatus(transactionObjetc, 'FAILED');
                return {
                    ok: false,
                    error: { step: 'CARD_TOKENIZATION', message: 'Error tokenizando la tarjeta' },
                };
            }

            // Paso 6: Crear la transacción

            const transaction = await this.wompiService.createTransaction({
                acceptanceToken: tokens.endUserPolicyToken,
                personalDataAuthToken: tokens.personalDataAuthToken,
                cardToken,
                amountInCents,
                reference,
                email: 'cliente@correo.com',
                installments: +dto.card.installments,
            });

            if (!transaction) {
                updateTransactionStatus(transactionObjetc, 'FAILED');
                return {
                    ok: false,
                    error: { step: 'TRANSACTION', message: 'Error creando la transacción' },
                };
            }

            // Paso 7: Actualizar la transacción en la base de datos
            transactionObjetc.gatewayTransactionId = transaction.transactionId;
            await this.transactionRepository.updateGatewayTransactionId(transactionObjetc.id_transaction, transaction.transactionId);

            const maxRetries = 10;
            let currentRetry = 0;
            let status: string | null = 'PENDING';

            // Paso 8: Validar el estado de la transacción
            while (status === 'PENDING' && currentRetry < maxRetries) {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                status = await this.wompiService.getTransactionStatus(transaction.transactionId);
                currentRetry++;
            }

            // Paso 9: Actualizar el estado de la transacción en la base de datos
            if (status !== null)
                await this.transactionRepository.updateStatus(transactionObjetc.id_transaction, status);

            if (status !== 'APPROVED') {
                return {
                    ok: false,
                    error: {
                        step: 'TRANSACTION',
                        message: `La transacción no fue aprobada. Estado final: ${status}`,
                    },
                };
            }

            // Paso 10: Crear la entrega
            const delivery = new Delivery();
            delivery.address = dto.customer.address;
            delivery.delivery_status = 'PENDING';
            delivery.transaction = transactionObjetc;

            await this.deliveryRepository.save(delivery);

            // Paso 11: Actualizar el stock de los productos
            await this.productRepository.updateMultipleStock(
                dto.products.map((p) => ({
                    id: p.idProduct,
                    quantity: p.quantity,
                }))
            );

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
