# hydrate-app
> Quick app pre-loading using saved HTML snapshot

[![NPM][hydrate-app-icon] ][hydrate-app-url]

[![Build status][hydrate-app-ci-image] ][hydrate-app-ci-url]
[![semantic-release][semantic-image] ][semantic-url]
[![manpm](https://img.shields.io/badge/manpm-%E2%9C%93-3399ff.svg)](https://github.com/bahmutov/manpm)

See Vue.js [demo](http://glebbahmutov.com/hydrate-vue-todo/) and its 
[source](https://github.com/bahmutov/hydrate-vue-todo)

## Install

`npm install --save hydrate-app`

Include the script **right after the web app element** - this is important to prevent
the content after the element from shifting.

```html
<div id="myApp">...</div>
<script src="./node_modules/hydrate-app/hydrate-app.js"
  id="myApp"
  verbose="true"
  on="hydrate"
  verbose-ui="true"></script>
```

## API

### Script attributes

* `id` - the ID of the web application element to replace
* `verbose` - if set to "true" prints console log messages
* `verbose-ui` - show user popups
* `on` - optional. If exists and set to string `<name>`, 
  the `hydrate-app` factory function will look for `window[<name>]` flag
  to decide if it needs to hydrate. A good way to compare normal startup vs hydrated.

### JavaScript api

Once the script runs, it creates a global object called `bottle`. The `bottle`
has only a few methods for saving, loading and updating the HTML snapshot. The two
most important ones to call from your application are:

* `bottle.drink()` - call when your application has initialized and rendered itself.
* `bottle.refill(defer)` - call every time you want to take DOM snapshot. This snapshot
  will be rendered on the next page load.

The argument `defer` postpones the refill by scheduling it on the event queue - for
some frameworks this allows to actually update the DOM.

## Details

You can find the current (if any) HTML snapshot in the localStorage under `bottle-` + ID
key. If you want to erase the current snapshot, you can use `bottle.recycle()` method.

### Small print

Author: Gleb Bahmutov &copy; 2015

* [@bahmutov](https://twitter.com/bahmutov)
* [glebbahmutov.com](http://glebbahmutov.com)
* [blog](http://glebbahmutov.com/blog/)

License: MIT - do anything with the code, but don't blame me if it does not work.

Spread the word: tweet, star on github, etc.

Support: if you find any problems with this module, email / tweet /
[open issue](https://github.com/bahmutov/hydrate-app/issues) on Github

## MIT License

Copyright (c) 2015 Gleb Bahmutov

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

[hydrate-app-icon]: https://nodei.co/npm/hydrate-app.png?downloads=true
[hydrate-app-url]: https://npmjs.org/package/hydrate-app
[hydrate-app-ci-image]: https://travis-ci.org/bahmutov/hydrate-app.png?branch=master
[hydrate-app-ci-url]: https://travis-ci.org/bahmutov/hydrate-app
[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release
