import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmDeliveryRepository } from '../../../../src/infrastructure/delivery/repositories/typeorm-delivery.repository';
import { Delivery } from '../../../../src/domain/delivery/delivery.entity';
import { Transaction } from '../../../../src/domain/transaction/transaction.entity';

describe('TypeOrmDeliveryRepository', () => {
  let repo: TypeOrmDeliveryRepository;
  let repository: jest.Mocked<Repository<Delivery>>;

  const mockDelivery: Delivery = {
    id_delivery: 1,
    address: 'Calle Falsa 123',
    delivery_status: 'PENDING',
    transaction: {} as Transaction
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeOrmDeliveryRepository,
        {
          provide: getRepositoryToken(Delivery),
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    repo = module.get<TypeOrmDeliveryRepository>(TypeOrmDeliveryRepository);
    repository = module.get(getRepositoryToken(Delivery));
  });

  it('debería guardar una entrega (delivery)', async () => {
    repository.save.mockResolvedValueOnce(mockDelivery);

    const result = await repo.save(mockDelivery);

    expect(result).toEqual(mockDelivery);
    expect(repository.save).toHaveBeenCalledWith(mockDelivery);
    expect(repository.save).toHaveBeenCalledTimes(1);
  });
});
