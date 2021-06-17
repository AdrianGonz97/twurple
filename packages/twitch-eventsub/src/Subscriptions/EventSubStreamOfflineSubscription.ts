import type { HelixEventSubSubscription } from 'twitch';
import { rtfm } from 'twitch-common';
import type { EventSubStreamOfflineEventData } from '../Events/EventSubStreamOfflineEvent';
import { EventSubStreamOfflineEvent } from '../Events/EventSubStreamOfflineEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('twitch-eventsub', 'EventSubSubscription')
export class EventSubStreamOfflineSubscription extends EventSubSubscription<EventSubStreamOfflineEvent> {
	constructor(
		handler: (data: EventSubStreamOfflineEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `stream.offline.${this._userId}`;
	}

	protected transformData(data: EventSubStreamOfflineEventData): EventSubStreamOfflineEvent {
		return new EventSubStreamOfflineEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return this._client._apiClient.helix.eventSub.subscribeToStreamOfflineEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
