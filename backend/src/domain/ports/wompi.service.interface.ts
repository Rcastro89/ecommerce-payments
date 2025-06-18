import { PaymentRequestDto } from '../../infrastructure/payment/dto/payment-request.dto';

export interface IWompiService {
  getAcceptanceToken(): Promise<string | null>;
  tokenizeCard(dto: PaymentRequestDto): Promise<string | null>;
}
