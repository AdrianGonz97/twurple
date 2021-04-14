import type { MessageParam } from 'ircv3';
import { Message, MessageParamDefinition, MessageType } from 'ircv3';
import { ChatUser } from '../../../ChatUser';
import type { ParsedMessagePart } from '../../../Toolkit/EmoteTools';
import { fillTextPositions, parseEmoteOffsets, parseEmotePositions } from '../../../Toolkit/EmoteTools';

/** @private */
@MessageType('WHISPER')
export class Whisper extends Message<Whisper> {
	@MessageParamDefinition()
	target!: MessageParam;

	@MessageParamDefinition({
		trailing: true,
		optional: true
	})
	message!: MessageParam;

	get userInfo(): ChatUser {
		return new ChatUser(this._prefix!.nick, this._tags);
	}

	get emoteOffsets(): Map<string, string[]> {
		return parseEmoteOffsets(this._tags.get('emotes'));
	}

	parseEmotes(): ParsedMessagePart[] {
		const messageText = this.params.message;
		const foundEmotes: ParsedMessagePart[] = parseEmotePositions(messageText, this.emoteOffsets);

		return fillTextPositions(messageText, foundEmotes);
	}
}
