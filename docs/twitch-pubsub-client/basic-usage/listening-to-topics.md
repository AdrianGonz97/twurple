First, you have to create an instance of the Twitch API client, as outlined in [its own documentation](/api/docs/basic-usage/creating-instance).

Then, you register that instance with a new {@PubSubClient} instance:

```typescript
import { PubSubClient } from '@twurple/pubsub';

const pubSubClient = new PubSubClient();
const userId = await pubSubClient.registerUserListener(apiClient);
```

It's very easy to listen to events in any channel an API client is registered for now:

```typescript
import { PubSubSubscriptionMessage } from '@twurple/pubsub';

const listener = await pubSubClient.onSubscription(userId, (message: PubSubSubscriptionMessage) => {
	console.log(`${message.userDisplayName} just subscribed!`);
});
```

When you don't want to listen to these events anymore, you just remove the listener:

```typescript
listener.remove();
```
