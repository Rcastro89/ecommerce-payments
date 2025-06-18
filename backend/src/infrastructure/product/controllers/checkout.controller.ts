import { Body, Controller, Post } from '@nestjs/common';
import { CheckoutUseCase } from '../../../application/use-cases/checkout.use-case';
import { CheckoutRequestDto } from '../dto/checkout-request.dto';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutUseCase: CheckoutUseCase) {}

  @Post()
  async checkout(@Body() body: CheckoutRequestDto) {
    const result = await this.checkoutUseCase.execute(body.products);

    if (!result.ok) {
      return {
        success: false,
        errors: result.error,
      };
    }

    return {
      success: true,
      message: result.value,
    };
  }
}
