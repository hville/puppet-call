# puppet-call

*run a function in puppeteer with active server, browser and page*

## Examples

```javascript
const puppetCall = require('../src/puppet-call')

puppetCall({
  browser: {headless: false},
  server: {
    route: {
    '/': '<!DOCTYPE html>'
    }
  }
}, page => page.evaluate('1+1')
})
```

## Features, Limitations, Gotcha

* small wrapper around puppeteer to initiate the server and the browser page
* `puppeteer` listed as peerDependency due to the size and must be installed seperatly

## API

`puppetCall(options, getResult): Promise<result>`
* options.server: local dev server options, no server if not specified
  * `.root`, `.route`, `.port`, `.host`
* options.browser: options for puppeteer.launch
  * `.headless`, `devtools`, `.dumpio`, ...
* getResult: function(this:browser, page): result

## License

[MIT](http://www.opensource.org/licenses/MIT) © [Hugo Villeneuve](https://github.com/hville)
