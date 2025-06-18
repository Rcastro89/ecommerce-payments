import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { IWompiService } from '../../domain/ports/wompi.service.interface';
import { PaymentRequestDto } from '../payment/dto/payment-request.dto';

@Injectable()
export class WompiService implements IWompiService {
  private readonly baseUrl = process.env.WOMPI_SANDBOX_URL;
  private readonly publicKey = process.env.WOMPI_PUBLIC_KEY;

  async getAcceptanceToken(): Promise<string | null> {
    try {
      const url = `${this.baseUrl}/merchants/${this.publicKey}`;
      const response = await axios.get(url);
      return response.data?.data?.presigned_acceptance?.acceptance_token || null;
    } catch (error) {
      console.error('[WompiService] Error getting acceptance token', error);
      return null;
    }
  }

  async tokenizeCard(dto: PaymentRequestDto): Promise<string | null> {
    try {
      const url = `${this.baseUrl}/tokens/cards`;
      const response = await axios.post(
        url,
        dto.card,
        {
          headers: {
            Authorization: `Bearer ${this.publicKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data?.data?.id || null;
    } catch (error) {
      console.error('[WompiService] Error tokenizing card', error);
      return null;
    }
  }
}
