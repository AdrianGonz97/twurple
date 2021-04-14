For auto refreshing to work reliably, you need to persist your current access/refresh token pair and the token expiry
timestamp in some way.

This example uses files to make it easily understandable, but you should probably use a database or similar,
especially if you need to fetch data for more than one user.

It also assumes that you pre-populated this file (in this example named `tokens.json`) with some data:

```json
{
    "accessToken": "INITIAL_ACCESS_TOKEN",
    "refreshToken": "INITIAL_REFRESH_TOKEN",
    "expiryTimestamp": 0
}
```

Note that `expiryTimestamp` is set to 0, which forces the application to make a refresh call the first time you start it.
This is done to prevent having to calculate the initial expiry timestamp manually.

```ts twoslash
// @module: esnext
// @target: ES2017
// lib stubs until @lib is fixed
declare const JSON: any;
declare const Date: any;
// also silence TS complaining about Promise not existing (even a stub doesn't work)
// + declare module 'fs'; errors
// @errors: 2307 2697
// ---cut---
import { RefreshableAuthProvider, StaticAuthProvider } from '@twurple/auth';
import { promises as fs } from 'fs';

const clientId = 'YOUR_CLIENT_ID';
const clientSecret = 'YOUR_CLIENT_SECRET';
const tokenData = JSON.parse(await fs.readFile('./tokens.json', 'UTF-8'));
const authProvider = new RefreshableAuthProvider(
    new StaticAuthProvider(clientId, tokenData.accessToken),
    {
        clientSecret,
        refreshToken: tokenData.refreshToken,
        expiry: tokenData.expiryTimestamp === null ? null : new Date(tokenData.expiryTimestamp),
        onRefresh: async ({ accessToken, refreshToken, expiryDate }) => {
            const newTokenData = {
                accessToken,
                refreshToken,
                expiryTimestamp: expiryDate === null ? null : expiryDate.getTime()
            };
            await fs.writeFile('./tokens.json', JSON.stringify(newTokenData, null, 4), 'UTF-8')
        }
    }
);
```
