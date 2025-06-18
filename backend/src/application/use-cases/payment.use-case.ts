import { Inject, Injectable } from '@nestjs/common';
import { IWompiService } from '../../domain/ports/wompi.service.interface';
import { PaymentRequestDto } from '../../infrastructure/payment/dto/payment-request.dto';

type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

@Injectable()
export class PaymentUseCase {
  constructor(
    @Inject('IWompiService')
    private readonly wompiService: IWompiService,
  ) {}

  async execute(dto: PaymentRequestDto): Promise<
    Result<
      { acceptanceToken: string; cardToken: string },
      { step: 'ACCEPTANCE_TOKEN' | 'CARD_TOKENIZATION'; message: string }
    >
  > {
    try {
      // Paso 1: Obtener acceptance token
      const acceptanceToken = await this.wompiService.getAcceptanceToken();
      if (!acceptanceToken) {
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

      return {
        ok: true,
        value: {
          acceptanceToken,
          cardToken,
        },
      };
    } catch (error) {
      return {
        ok: false,
        error: { step: 'CARD_TOKENIZATION', message: 'Error inesperado: ' + error.message },
      };
    }
  }
}
