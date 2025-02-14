import { Enumerable } from '@d-fischer/shared-utils';
import type { ApiClient, HelixUser } from '@twurple/api';
import { checkRelationAssertion, DataObject, rawDataSymbol, rtfm } from '@twurple/common';
import { EventSubChannelCharityAmount } from './common/EventSubChannelCharityAmount';
import { type EventSubChannelCharityCampaignProgressEventData } from './EventSubChannelCharityCampaignProgressEvent.external';

/**
 * An EventSub event representing progress of a charity campaign in a channel.
 */
@rtfm<EventSubChannelCharityCampaignProgressEvent>('eventsub-base', 'EventSubChannelCharityCampaignProgressEvent', 'id')
export class EventSubChannelCharityCampaignProgressEvent extends DataObject<EventSubChannelCharityCampaignProgressEventData> {
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: EventSubChannelCharityCampaignProgressEventData, client: ApiClient) {
		super(data);
		this._client = client;
	}

	/**
	 * An ID that identifies the charity campaign.
	 */
	get id(): string {
		return this[rawDataSymbol].id;
	}

	/**
	 * The ID of the broadcaster.
	 */
	get broadcasterId(): string {
		return this[rawDataSymbol].broadcaster_id;
	}

	/**
	 * The name of the broadcaster.
	 */
	get broadcasterName(): string {
		return this[rawDataSymbol].broadcaster_login;
	}

	/**
	 * The display name of the broadcaster.
	 */
	get broadcasterDisplayName(): string {
		return this[rawDataSymbol].broadcaster_name;
	}

	/**
	 * Gets more information about the broadcaster.
	 */
	async getBroadcaster(): Promise<HelixUser> {
		return checkRelationAssertion(await this._client.users.getUserById(this[rawDataSymbol].broadcaster_id));
	}

	/**
	 * The name of the charity.
	 */
	get charityName(): string {
		return this[rawDataSymbol].charity_name;
	}

	/**
	 * A description of the charity.
	 */
	get charityDescription(): string {
		return this[rawDataSymbol].charity_description;
	}

	/**
	 * A URL to an image of the of the charity;s logo. The image’s type is PNG and its size is 100px X 100px.
	 */
	get charityLogo(): string {
		return this[rawDataSymbol].charity_logo;
	}

	/**
	 * A URL to the charity’s website.
	 */
	get charityWebsite(): string {
		return this[rawDataSymbol].charity_website;
	}

	/**
	 * An object that contains the current amount of donations that the campaign has received.
	 */
	get currentAmount(): EventSubChannelCharityAmount {
		return new EventSubChannelCharityAmount(this[rawDataSymbol].current_amount);
	}

	/**
	 * An object that contains the campaign’s target fundraising goal.
	 */
	get targetAmount(): EventSubChannelCharityAmount {
		return new EventSubChannelCharityAmount(this[rawDataSymbol].target_amount);
	}
}
