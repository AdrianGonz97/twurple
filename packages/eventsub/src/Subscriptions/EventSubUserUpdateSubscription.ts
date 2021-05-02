import type { HelixEventSubSubscription } from '@twurple/api';
import { rtfm } from '@twurple/common';
import type { EventSubUserUpdateEventData } from '../Events/EventSubUserUpdateEvent';
import { EventSubUserUpdateEvent } from '../Events/EventSubUserUpdateEvent';
import type { EventSubListener } from '../EventSubListener';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('eventsub', 'EventSubSubscription')
export class EventSubUserUpdateSubscription extends EventSubSubscription<EventSubUserUpdateEvent> {
	constructor(
		handler: (data: EventSubUserUpdateEvent) => void,
		client: EventSubListener,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `user.update.${this._userId}`;
	}

	protected transformData(data: EventSubUserUpdateEventData): EventSubUserUpdateEvent {
		return new EventSubUserUpdateEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return await this._client._apiClient.helix.eventSub.subscribeToUserUpdateEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
