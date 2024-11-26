import { EventClient } from '../../event/event-client.model';

export class UserLeaveRoomRequest {
  user: EventClient;
  all: EventClient[];
}