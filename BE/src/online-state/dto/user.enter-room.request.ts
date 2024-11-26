import { EventClient } from '../../event/event-client.model';

export class UserEnterRoomRequest {
  user: EventClient;
  all: EventClient[];
}