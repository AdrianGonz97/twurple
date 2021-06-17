import type { HelixEventSubSubscription } from 'twitch';
import { rtfm } from 'twitch-common';
import type { EventSubChannelHypeTrainProgressEventData } from '../Events/EventSubChannelHypeTrainProgressEvent';
import { EventSubChannelHypeTrainProgressEvent } from '../Events/EventSubChannelHypeTrainProgressEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('twitch-eventsub', 'EventSubSubscription')
export class EventSubChannelHypeTrainProgressSubscription extends EventSubSubscription<EventSubChannelHypeTrainProgressEvent> {
	constructor(
		handler: (data: EventSubChannelHypeTrainProgressEvent) => void,
		client: EventSubBase,
		private readonly _userId: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.hype_train.progress.${this._userId}`;
	}

	protected transformData(data: EventSubChannelHypeTrainProgressEventData): EventSubChannelHypeTrainProgressEvent {
		return new EventSubChannelHypeTrainProgressEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		return this._client._apiClient.helix.eventSub.subscribeToChannelHypeTrainProgressEvents(
			this._userId,
			await this._getTransportOptions()
		);
	}
}
