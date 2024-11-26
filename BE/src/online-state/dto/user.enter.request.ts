import { EventClient } from '../../event/event-client.model';

export class UserEnterRequest {
  user: EventClient;
  all: EventClient[];
}