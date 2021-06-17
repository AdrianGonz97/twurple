import type { HelixEventSubSubscription } from 'twitch';
import { rtfm } from 'twitch-common';
import type { EventSubUserAuthorizationRevokeEventData } from '../Events/EventSubUserAuthorizationRevokeEvent';
import { EventSubUserAuthorizationRevokeEvent } from '../Events/EventSubUserAuthorizationRevokeEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('twitch-eventsub', 'EventSubSubscription')
export class EventSubUserAuthorizationRevokeSubscription extends EventSubSubscription<EventSubUserAuthorizationRevokeEvent> {
	constructor(
		handler: (data: EventSubUserAuthorizationRevokeEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `user.authorization.revoke.${this._userId}`;
	}

	protected transformData(data: EventSubUserAuthorizationRevokeEventData): EventSubUserAuthorizationRevokeEvent {
		return new EventSubUserAuthorizationRevokeEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return this._client._apiClient.helix.eventSub.subscribeToUserAuthorizationRevokeEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
