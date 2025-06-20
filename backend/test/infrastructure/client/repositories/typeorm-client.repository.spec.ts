import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TypeOrmClientRepository } from '../../../../src/infrastructure/client/repositories/typeorm-client.repository';
import { Client } from '../../../../src/domain/client/client.entity';

describe('TypeOrmClientRepository', () => {
  let repo: TypeOrmClientRepository;
  let repository: jest.Mocked<Repository<Client>>;

  const mockClient: Client = {
    id_client: 1,
    full_name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '1234567890',
    created_at: new Date(),
    transactions: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeOrmClientRepository,
        {
          provide: getRepositoryToken(Client),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    repo = module.get<TypeOrmClientRepository>(TypeOrmClientRepository);
    repository = module.get(getRepositoryToken(Client));
  });

  it('debería guardar un cliente', async () => {
    repository.save.mockResolvedValueOnce(mockClient);

    const result = await repo.save(mockClient);

    expect(result).toEqual(mockClient);
    expect(repository.save).toHaveBeenCalledWith(mockClient);
    expect(repository.save).toHaveBeenCalledTimes(1);
  });

  it('debería encontrar un cliente por ID', async () => {
    repository.findOne.mockResolvedValueOnce(mockClient);

    const result = await repo.findById(1);

    expect(result).toEqual(mockClient);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id_client: 1 } });
    expect(repository.findOne).toHaveBeenCalledTimes(1);
  });
});
