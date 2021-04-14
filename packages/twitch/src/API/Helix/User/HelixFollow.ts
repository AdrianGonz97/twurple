import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
import type { ApiClient } from '../../../ApiClient';
import type { HelixUser } from './HelixUser';

/** @private */
export interface HelixFollowData {
	from_id: string;
	from_login: string;
	from_name: string;
	to_id: string;
	to_login: string;
	to_name: string;
	followed_at: string;
}

/**
 * A relation of a user following a broadcaster.
 */
@rtfm('twitch', 'HelixFollow')
export class HelixFollow {
	@Enumerable(false) private readonly _data: HelixFollowData;
	@Enumerable(false) private readonly _client: ApiClient;

	/** @private */
	constructor(data: HelixFollowData, client: ApiClient) {
		this._data = data;
		this._client = client;
	}

	/**
	 * The user ID of the following user.
	 */
	get userId(): string {
		return this._data.from_id;
	}

	/**
	 * The name of the following user.
	 */
	get userName(): string {
		return this._data.from_login;
	}

	/**
	 * The display name of the following user.
	 */
	get userDisplayName(): string {
		return this._data.from_name;
	}

	/**
	 * Retrieves the data of the following user.
	 */
	async getUser(): Promise<HelixUser | null> {
		return this._client.helix.users.getUserById(this._data.from_id);
	}

	/**
	 * The user ID of the followed broadcaster.
	 */
	get followedUserId(): string {
		return this._data.to_id;
	}

	/**
	 * The name of the followed user.
	 */
	get followedUserName(): string {
		return this._data.to_login;
	}

	/**
	 * The display name of the followed user.
	 */
	get followedUserDisplayName(): string {
		return this._data.to_name;
	}

	/**
	 * Retrieves the data of the followed broadcaster.
	 */
	async getFollowedUser(): Promise<HelixUser | null> {
		return this._client.helix.users.getUserById(this._data.to_id);
	}

	/**
	 * The date when the user followed the broadcaster.
	 */
	get followDate(): Date {
		return new Date(this._data.followed_at);
	}
}
