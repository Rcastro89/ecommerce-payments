import { PaymentUseCase } from '../../../src/application/use-cases/payment.use-case';
import { IWompiService } from '../../../src/domain/ports/wompi.service.interface';
import { ClientRepository } from '../../../src/domain/client/client.repository';
import { TransactionRepository } from '../../../src/domain/transaction/transaction.repository';
import { TransactionItemRepository } from '../../../src/domain/transaction/transaction-item.repository';
import { DeliveryRepository } from '../../../src/domain/delivery/delivery.repository';
import { ProductRepository } from '../../../src/domain/product/product.repository';
import { PaymentRequestDto } from '../../../src/infrastructure/payment/dto/payment-request.dto';

describe('PaymentUseCase', () => {
    let useCase: PaymentUseCase;

    // Mocks
    const mockWompiService = {
        getAcceptanceToken: jest.fn(),
        tokenizeCard: jest.fn(),
        createTransaction: jest.fn(),
        getTransactionStatus: jest.fn(),
    };

    const mockClientRepo = {
        findById: jest.fn(),
        save: jest.fn(),
    };

    const mockTransactionRepo = {
        createPendingTransaction: jest.fn(),
        updateGatewayTransactionId: jest.fn(),
        updateStatus: jest.fn(),
    };

    const mockTransactionItemRepo = {
        save: jest.fn(),
    };

    const mockDeliveryRepo = {
        save: jest.fn(),
    };

    const mockProductRepo = {
        updateMultipleStock: jest.fn(),
    };

    beforeEach(() => {
        useCase = new PaymentUseCase(
            mockWompiService as unknown as IWompiService,
            mockClientRepo as unknown as ClientRepository,
            mockTransactionRepo as unknown as TransactionRepository,
            mockTransactionItemRepo as unknown as TransactionItemRepository,
            mockDeliveryRepo as unknown as DeliveryRepository,
            mockProductRepo as unknown as ProductRepository
        );
    });

    const dto: PaymentRequestDto = {
        customer: {
            idClient: "1",
            fullName: 'Juan Pérez',
            phone: '1234567890',
            email: 'juan@correo.com',
            address: 'Calle Falsa 123',
        },
        products: [
            { idProduct: 10, quantity: 2, unitPrice: 5000 }
        ],
        card: {
            number: '4242424242424242',
            cvc: '123',
            exp_month: '12',
            exp_year: '2026',
            card_holder: 'Juan Pérez',
            installments: '1'
        }
    };

    const transactionMock = {
        id_transaction: 1,
        status: 'PENDING',
    };

    it('debería ejecutar el flujo completo de pago exitoso', async () => {
        mockClientRepo.findById.mockResolvedValue(null);
        mockClientRepo.save.mockResolvedValue(undefined);
        mockTransactionRepo.createPendingTransaction.mockResolvedValue(transactionMock);
        mockTransactionItemRepo.save.mockResolvedValue(undefined);
        mockWompiService.getAcceptanceToken.mockResolvedValue({
            endUserPolicyToken: 'token123',
            personalDataAuthToken: 'auth456'
        });
        mockWompiService.tokenizeCard.mockResolvedValue('cardToken789');
        mockWompiService.createTransaction.mockResolvedValue({
            transactionId: 'tx123'
        });
        mockWompiService.getTransactionStatus.mockResolvedValue('APPROVED');
        mockTransactionRepo.updateGatewayTransactionId.mockResolvedValue(undefined);
        mockTransactionRepo.updateStatus.mockResolvedValue(undefined);
        mockDeliveryRepo.save.mockResolvedValue(undefined);
        mockProductRepo.updateMultipleStock.mockResolvedValue(undefined);

        const result = await useCase.execute(dto);

        expect(result.ok).toBe(true);
        if (result.ok) {
            expect(result.value.status).toBe('APPROVED');
        }

        expect(mockTransactionRepo.createPendingTransaction).toHaveBeenCalled();
        expect(mockWompiService.createTransaction).toHaveBeenCalled();
        expect(mockDeliveryRepo.save).toHaveBeenCalled();
    });

    it('debería fallar cuando no se obtiene el acceptance token', async () => {
        // Arrange
        const mockDto = { ...dto }; // puedes reutilizar el dto que tengas definido arriba

        mockClientRepo.findById.mockResolvedValue(null);
        mockClientRepo.save.mockResolvedValue({});

        mockTransactionRepo.createPendingTransaction.mockResolvedValue({
            id_transaction: 1,
            gatewayTransactionId: null,
        });

        mockTransactionRepo.createPendingTransaction.mockResolvedValue(transactionMock);

        mockWompiService.getAcceptanceToken.mockResolvedValue(null);

        // Act
        const result = await useCase.execute(mockDto);

        // Assert
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.step).toBe('ACCEPTANCE_TOKEN');
            expect(result.error.message).toContain('Error obteniendo acceptance token');
        } else {
            fail('La operación debería haber fallado');
        }
    });

    it('debería fallar cuando la tokenización de la tarjeta falla', async () => {
        mockClientRepo.findById.mockResolvedValue(null);
        mockClientRepo.save.mockResolvedValue({});

        mockTransactionRepo.createPendingTransaction.mockResolvedValue(transactionMock);
        mockTransactionItemRepo.save.mockResolvedValue(undefined);

        mockWompiService.getAcceptanceToken.mockResolvedValue({
            endUserPolicyToken: 'token123',
            personalDataAuthToken: 'auth456'
        });

        mockWompiService.tokenizeCard.mockResolvedValue(null);

        // Act
        const result = await useCase.execute(dto);

        // Assert
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.step).toBe('CARD_TOKENIZATION');
            expect(result.error.message).toContain('Error tokenizando la tarjeta');
        } else {
            fail('La operación debería haber fallado');
        }
    });

    it('debería fallar cuando la creación de la transacción en Wompi falla', async () => {
        mockClientRepo.findById.mockResolvedValue(null);
        mockClientRepo.save.mockResolvedValue({});
        mockTransactionRepo.createPendingTransaction.mockResolvedValue(transactionMock);
        mockTransactionItemRepo.save.mockResolvedValue(undefined);

        mockWompiService.getAcceptanceToken.mockResolvedValue({
            endUserPolicyToken: 'token123',
            personalDataAuthToken: 'auth456',
        });

        mockWompiService.tokenizeCard.mockResolvedValue('mockCardToken');
        mockWompiService.createTransaction.mockResolvedValue(null);

        // Act
        const result = await useCase.execute(dto);

        // Assert
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.step).toBe('TRANSACTION');
            expect(result.error.message).toContain('Error creando la transacción');
        } else {
            fail('La operación debería haber fallado');
        }
    });

    it('debería fallar si la transacción no es aprobada luego del polling', async () => {
        mockClientRepo.findById.mockResolvedValue(null);
        mockClientRepo.save.mockResolvedValue({});
        mockTransactionRepo.createPendingTransaction.mockResolvedValue(transactionMock);
        mockTransactionItemRepo.save.mockResolvedValue(undefined);

        mockWompiService.getAcceptanceToken.mockResolvedValue({
            endUserPolicyToken: 'token123',
            personalDataAuthToken: 'auth456',
        });

        mockWompiService.tokenizeCard.mockResolvedValue('mockCardToken');
        mockWompiService.createTransaction.mockResolvedValue({ transactionId: 'tx123' });

        mockWompiService.getTransactionStatus.mockResolvedValue('DECLINED');

        mockTransactionRepo.updateGatewayTransactionId.mockResolvedValue(undefined);
        mockTransactionRepo.updateStatus.mockResolvedValue(undefined);

        // Act
        const result = await useCase.execute(dto);

        // Assert
        expect(result.ok).toBe(false);
        if (!result.ok) {
            expect(result.error.step).toBe('TRANSACTION');
            expect(result.error.message).toContain('no fue aprobada');
        } else {
            fail('La operación debería haber fallado');
        }
    });
});
