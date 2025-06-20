import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from '../../../../src/infrastructure/payment/controllers/payment.controller';
import { PaymentUseCase } from '../../../../src/application/use-cases/payment.use-case';
import { PaymentRequestDto } from '../../../../src/infrastructure/payment/dto/payment-request.dto';

describe('PaymentController', () => {
  let controller: PaymentController;
  let useCase: PaymentUseCase;

  const mockPaymentUseCase = {
    execute: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentUseCase,
          useValue: mockPaymentUseCase
        }
      ]
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockDto: PaymentRequestDto = {
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

  it('debería retornar el resultado exitoso del caso de uso', async () => {
    const mockResult = {
      ok: true,
      value: { status: 'APPROVED' }
    };

    mockPaymentUseCase.execute.mockResolvedValue(mockResult);

    const response = await controller.process(mockDto);

    expect(mockPaymentUseCase.execute).toHaveBeenCalledWith(mockDto);
    expect(response).toEqual(mockResult);
  });

  it('debería retornar el error del caso de uso si falla', async () => {
    const mockResult = {
      ok: false,
      error: {
        step: 'CARD_TOKENIZATION',
        message: 'Falló tokenización'
      }
    };

    mockPaymentUseCase.execute.mockResolvedValue(mockResult);

    const response = await controller.process(mockDto);

    expect(mockPaymentUseCase.execute).toHaveBeenCalledWith(mockDto);
    expect(response).toEqual(mockResult);
  });
});
