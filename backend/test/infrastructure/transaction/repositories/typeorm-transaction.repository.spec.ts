import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TypeOrmTransactionRepository } from '../../../../src/infrastructure/transaction/repositories/typeorm-transaction.repository';
import { Transaction } from '../../../../src/domain/transaction/transaction.entity';
import { Client } from '../../../../src/domain/client/client.entity';
import { Delivery } from '../../../../src/domain/delivery/delivery.entity';

describe('TypeOrmTransactionRepository', () => {
    let repo: TypeOrmTransactionRepository;
    let repository: jest.Mocked<Repository<Transaction>>;

    const mockTransaction: Transaction = {
        id_transaction: 1,
        transaction_uuid: 'uuid-123',
        status: 'PENDING',
        total: 5000,
        created_at: new Date(),
        client: { id_client: 1 } as Client,
        gatewayTransactionId: undefined,
        delivery: {} as Delivery,
        items: [],
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TypeOrmTransactionRepository,
                {
                    provide: getRepositoryToken(Transaction),
                    useValue: {
                        save: jest.fn(),
                        update: jest.fn(),
                        create: jest.fn(),
                    },
                },
            ],
        }).compile();

        repo = module.get<TypeOrmTransactionRepository>(TypeOrmTransactionRepository);
        repository = module.get(getRepositoryToken(Transaction));
    });

    it('debería guardar una transacción', async () => {
        repository.save.mockResolvedValueOnce(mockTransaction);

        const result = await repo.save(mockTransaction);

        expect(repository.save).toHaveBeenCalledWith(mockTransaction);
        expect(result).toEqual(mockTransaction);
    });

    it('debería actualizar el estado de una transacción', async () => {
        repository.update.mockResolvedValueOnce({
            raw: {},
            affected: 1,
            generatedMaps: [],
        });

        await repo.updateStatus(1, 'APPROVED');

        expect(repository.update).toHaveBeenCalledWith(1, { status: 'APPROVED' });
    });

    it('debería crear y guardar una transacción pendiente', async () => {
        repository.create.mockReturnValueOnce(mockTransaction);
        repository.save.mockResolvedValueOnce(mockTransaction);

        const result = await repo.createPendingTransaction('uuid-123', 1, 5000);

        expect(repository.create).toHaveBeenCalledWith({
            transaction_uuid: 'uuid-123',
            status: 'PENDING',
            total: 5000,
            created_at: expect.any(Date),
            client: { id_client: 1 },
        });

        expect(repository.save).toHaveBeenCalledWith(mockTransaction);
        expect(result).toEqual(mockTransaction);
    });

    it('debería actualizar el gatewayTransactionId', async () => {
        repository.update.mockResolvedValueOnce({
            raw: {},
            affected: 1,
            generatedMaps: [],
        });

        await repo.updateGatewayTransactionId(1, 'gateway-999');

        expect(repository.update).toHaveBeenCalledWith(1, { gatewayTransactionId: 'gateway-999' });
    });
});
