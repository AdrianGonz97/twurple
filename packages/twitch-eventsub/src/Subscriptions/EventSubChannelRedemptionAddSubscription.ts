import type { HelixEventSubSubscription } from 'twitch';
import { rtfm } from 'twitch-common';
import type { EventSubChannelRedemptionAddEventData } from '../Events/EventSubChannelRedemptionAddEvent';
import { EventSubChannelRedemptionAddEvent } from '../Events/EventSubChannelRedemptionAddEvent';
import type { EventSubBase } from '../EventSubBase';
import { EventSubSubscription } from './EventSubSubscription';

/**
 * @private
 */
@rtfm('twitch-eventsub', 'EventSubSubscription')
export class EventSubChannelRedemptionAddSubscription extends EventSubSubscription<EventSubChannelRedemptionAddEvent> {
	constructor(
		handler: (data: EventSubChannelRedemptionAddEvent) => void,
		client: EventSubBase,
		private readonly _userId: string,
		private readonly _rewardId?: string
	) {
		super(handler, client);
	}

	get id(): string {
		return `channel.channel_points_custom_reward_redemption.add.${this._userId}`;
	}

	protected transformData(data: EventSubChannelRedemptionAddEventData): EventSubChannelRedemptionAddEvent {
		return new EventSubChannelRedemptionAddEvent(data, this._client._apiClient);
	}

	protected async _subscribe(): Promise<HelixEventSubSubscription> {
		if (this._rewardId) {
			return this._client._apiClient.helix.eventSub.subscribeToChannelRedemptionAddEventsForReward(
				this._userId,
				this._rewardId,
				await this._getTransportOptions()
			);
		} else {
			return this._client._apiClient.helix.eventSub.subscribeToChannelRedemptionAddEvents(
				this._userId,
				await this._getTransportOptions()
			);
		}
	}
}
