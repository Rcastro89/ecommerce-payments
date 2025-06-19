import { Client } from './client.entity';

export abstract class ClientRepository {
  abstract save(client: Client): Promise<Client>;
  abstract findByEmail(email: string): Promise<Client | null>;
}
