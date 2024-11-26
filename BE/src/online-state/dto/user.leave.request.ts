import { EventClient } from '../../event/event-client.model';

export class UserLeaveRequest {
  user: EventClient;
  all: EventClient[];
}