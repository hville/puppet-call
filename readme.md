# puppet-call

*puppeteer helpers for testing*

## Examples

```javascript
const bundle = require('puppet-call/bundle') // same as require('puppet-call').bundle
const withServer = require('puppet-call/with-server') // same as require('puppet-call').withServer
const withPage = require('puppet-call/with-page') // same as require('puppet-call').withPage

withServer(
  {routes: {
    './mscript': bundle('./commonjsmodule.js')
    }
  },
  ({origin}) => withPage(origin, page=>page.evaluate(pageAction))
).then(
  result => console.log('result')
)
```


## Features, Limitations, Gotcha

* small wrapper function to properly close the server, browser and page after execution
* `puppeteer` is listed as peerDependency due to it's size and must be installed seperatly


## API

* `bundle(path): code`
  * bundles CJS modules into an IIFE for the browser
* `withServer(serverOptions, serverAction): Promise`
  * `serverAction({host, port, root, origin}):Promise`
  * `serverOptions: {root: string, port: number, routes: Object: host: string}`
  * Initiates a server, evaluate `serverAction`, then closes the server before returning the `serverAction` result
* `withPuppet: (launchOptions, puppetAction): Promise`
  * `puppetAction(browser):Promise`
  * Initiates `puppeteer`, evaluate `puppetAction`, then closes the browser before returning the `puppetAction` result
* `withPage: (origin, pageAction): Promise`
  * `pageAction(page):Promise`
  * Initiates `puppeteer`, navigate to `origin`, evaluate `pageAction`, then closes the browser before returning the `pageAction` result


## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
