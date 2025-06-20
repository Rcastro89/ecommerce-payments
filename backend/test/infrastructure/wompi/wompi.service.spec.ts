import { WompiService } from '../../../src/infrastructure/wompi/wompi.service';
import axios from 'axios';
import { PaymentRequestDto } from '../../../src/infrastructure/payment/dto/payment-request.dto';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('WompiService', () => {
    let service: WompiService;

    const env = {
        WOMPI_SANDBOX_URL: 'https://sandbox.wompi.co/v1',
        WOMPI_PUBLIC_KEY: 'pub_test_123',
        WOMPI_INTEGRITY_SECRET: 'secret123',
    };

    beforeAll(() => {
        process.env.WOMPI_SANDBOX_URL = env.WOMPI_SANDBOX_URL;
        process.env.WOMPI_PUBLIC_KEY = env.WOMPI_PUBLIC_KEY;
        process.env.WOMPI_INTEGRITY_SECRET = env.WOMPI_INTEGRITY_SECRET;
    });

    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {});
        service = new WompiService();
        jest.clearAllMocks();
    });

    it('debería obtener el acceptance token', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: {
                data: {
                    presigned_acceptance: {
                        acceptance_token: 'token123',
                        personal_data_auth_token: 'personalToken123',
                    },
                },
            },
        });

        const tokens = await service.getAcceptanceToken();
        expect(tokens).toEqual({
            endUserPolicyToken: 'token123',
            personalDataAuthToken: 'personalToken123',
        });
    });

    it('debería retornar null si falla al obtener el acceptance token', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('Network Error'));
        const tokens = await service.getAcceptanceToken();
        expect(tokens).toBeNull();
    });

    it('debería tokenizar la tarjeta correctamente', async () => {
        mockedAxios.post.mockResolvedValueOnce({
            data: { data: { id: 'card_token_123' } },
        });

        const dto = {
            card: {
                number: '4242424242424242',
                exp_month: '12',
                exp_year: '29',
                cvc: '123',
                card_holder: 'John Doe',
            },
        } as PaymentRequestDto;

        const token = await service.tokenizeCard(dto);
        expect(token).toBe('card_token_123');
    });

    it('debería retornar null si falla la tokenización de tarjeta', async () => {
        mockedAxios.post.mockRejectedValueOnce(new Error('Token Error'));
        const token = await service.tokenizeCard({} as PaymentRequestDto);
        expect(token).toBeNull();
    });

    it('debería crear una transacción y retornar el id', async () => {
        mockedAxios.post.mockResolvedValueOnce({
            data: { data: { id: 'tx_12345' } },
        });

        const txData = {
            acceptanceToken: 'token123',
            personalDataAuthToken: 'auth123',
            cardToken: 'card123',
            amountInCents: 500000,
            reference: 'ref001',
            email: 'test@example.com',
            installments: 1,
        };

        const result = await service.createTransaction(txData);
        expect(result).toEqual({ transactionId: 'tx_12345' });
    });

    it('debería obtener el estado de la transacción', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: { data: { status: 'APPROVED' } },
        });

        const status = await service.getTransactionStatus('tx_12345');
        expect(status).toBe('APPROVED');
    });

    it('debería retornar null si falla al obtener el estado de la transacción', async () => {
        mockedAxios.get.mockRejectedValueOnce(new Error('Error estado'));
        const status = await service.getTransactionStatus('tx_999');
        expect(status).toBeNull();
    });
});
