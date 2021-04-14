For Electron apps, there is a separate package that can handle authentication on its own. To install it, run:

	yarn add @twurple/auth-electron

or using npm:

	npm install @twurple/auth-electron
	
After that, you just have to provide some basic information to the library to make it provide user access tokens to your application:

```ts twoslash
import { ElectronAuthProvider } from '@twurple/auth-electron';

const clientId = 'YOUR_CLIENT_ID';
const redirectUri = 'http://foo.bar/login';

const authProvider = new ElectronAuthProvider({
    clientId,
    redirectUri
});
```

Please note that this currently only works from the *main thread*.

To allow the user to "log out" and change to another account, use:

```ts
authProvider.allowUserChange();
```
