import { Body, Controller, Post } from '@nestjs/common';
import { PaymentRequestDto } from '../dto/payment-request.dto';
import { PaymentUseCase } from '../../../application/use-cases/payment.use-case';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentUseCase: PaymentUseCase) {}

  @Post()
  async process(@Body() body: PaymentRequestDto) {
    const result = await this.paymentUseCase.execute(body);
    return result;
  }
}
