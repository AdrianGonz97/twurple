import { Enumerable } from '@d-fischer/shared-utils';
import { rtfm } from '@twurple/common';
import { type EventSubListener } from '@twurple/eventsub-base';
import { defaultOnError, type NextFunction, type Request, type Response, Server } from 'httpanda';
import { type ConnectionAdapter } from './adapters/ConnectionAdapter';
import { EventSubHttpBase, type EventSubHttpBaseConfig } from './EventSubHttpBase';

/**
 * Certificate data used to make the listener server SSL capable.
 */
export interface EventSubHttpListenerCertificateConfig {
	/**
	 * The private key of your SSL certificate.
	 */
	key: string;

	/**
	 * Your full SSL certificate chain, including all intermediate certificates.
	 */
	cert: string;
}

/**
 * Configuration for an EventSub HTTP listener.
 *
 * @inheritDoc
 */
export interface EventSubHttpListenerConfig extends EventSubHttpBaseConfig {
	/**
	 * The connection adapter responsible for the configuration of the connection method.
	 */
	adapter: ConnectionAdapter;
}

/**
 * An HTTP listener for the Twitch EventSub event distribution mechanism.
 *
 * :::warning{title="Where are the event methods?"}
 *
 * Currently, there is a problem with the documentation generator.
 *
 * The event methods documented at {@link EventSubListener} are also in this class.
 *
 * :::
 *
 * @hideProtected
 * @inheritDoc
 *
 * @meta category main
 */
@rtfm('eventsub-http', 'EventSubHttpListener')
export class EventSubHttpListener extends EventSubHttpBase implements EventSubListener {
	@Enumerable(false) private _server?: Server;
	private readonly _adapter: ConnectionAdapter;

	/**
	 * Creates a new EventSub HTTP listener.
	 *
	 * @param config
	 *
	 * @expandParams
	 */
	constructor(config: EventSubHttpListenerConfig) {
		super(config);
		this._adapter = config.adapter;
	}

	/**
	 * Starts the HTTP listener.
	 */
	start(): void {
		if (this._server) {
			throw new Error('Trying to start while already running');
		}
		const server = this._adapter.createHttpServer();
		this._server = new Server({
			server,
			onError: async (e, req: Request, res: Response, next: NextFunction) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				if (e.code === 404 && !(await this._isHostDenied(req))) {
					this._logger.warn(`Access to unknown URL/method attempted: ${req.method!} ${req.url!}`);
				}
				defaultOnError(e, req, res, next);
			}
		});
		// needs to be first in chain but run last, for proper logging of status
		this._server.use((req, res, next) => {
			setImmediate(() => {
				this._logger.debug(`${req.method!} ${req.path} - ${res.statusCode}`);
			});
			next();
		});
		let requestPathPrefix: string | undefined = undefined;
		if (this._adapter.usePathPrefixInHandlers) {
			requestPathPrefix = this._adapter.pathPrefix;
			if (requestPathPrefix) {
				requestPathPrefix = `/${requestPathPrefix.replace(/^\/|\/$/g, '')}`;
			}
		}

		const healthHandler = this._createHandleHealthRequest();
		const dropLegacyHandler = this._createDropLegacyRequest();
		const requestHandler = this._createHandleRequest();

		if (requestPathPrefix) {
			this._server.post(`${requestPathPrefix}/event/:id`, requestHandler);
			this._server.post(`${requestPathPrefix}/:id`, dropLegacyHandler);
			this._server.get(`${requestPathPrefix}`, healthHandler);
		} else {
			this._server.post('/event/:id', requestHandler);
			this._server.post('/:id', dropLegacyHandler);
			this._server.get('/', healthHandler);
		}

		const adapterListenerPort = this._adapter.listenerPort;
		const listenerPort = adapterListenerPort ?? 443;
		this._server
			.listen(listenerPort)
			.then(async () => {
				this._readyToSubscribe = true;
				this._logger.info(`Listening on port ${listenerPort}`);
				await this._resumeExistingSubscriptions();
			})
			.catch(e => {
				this._logger.crit(`Could not listen on port ${listenerPort}: ${(e as Error).message}`);
			});
	}

	/**
	 * Stops the HTTP listener.
	 */
	stop(): void {
		if (!this._server) {
			throw new Error('Trying to stop while not running');
		}

		for (const sub of this._subscriptions.values()) {
			sub.suspend();
		}

		this._server.close().then(
			() => {
				this._server = undefined;
				this._readyToSubscribe = false;
			},
			e => this._logger.crit(`Could not stop listener: ${(e as Error).message}`)
		);
	}

	protected async getHostName(): Promise<string> {
		return await this._adapter.getHostName();
	}

	protected async getPathPrefix(): Promise<string | undefined> {
		return this._adapter.pathPrefix;
	}
}
