import { Client } from './client.entity';

export abstract class ClientRepository {
  abstract save(client: Client): Promise<Client>;
  abstract findById(id: number): Promise<Client | null>;
}
