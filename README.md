Constantine Dobrovolskiy bajjy.com

This library was created to show all the power of ES6, which is supported by all modern browsers. No frames are no longer needed. Under 50 lines of code and you get rid of vendorlock, you will not have to pull billions of dependencies, use special type files or preloaders.

Article on my website: [es6 templates](http://bajjy.com/es6-templates.html)
## nodejs
import templates and run templates
```javascript
import { Templates } from './modules/class.es6templates';
var tpl = new Templates('/from/html', '/to', '/from/html/includes') //includes is folder with header, footer or other modules
tpl.first()
```

## Use in js
Just add a script to your projecs as a `ES6 module`
```javascript
<script src="es6templates.js" type="module"></script>
```
Dont forget to include it somewhere in your code
```javascript
import * as templates from '../es6templates.js';
```
Or You can use any bundler you like.
[babel](https://babeljs.io/), [webpack](https://webpack.js.org/)
or if you are not a hipster, but true developer — [rollup](https://rollupjs.org/) or [multihawker](https://github.com/bajjy/multihawker).

## Using
This lib using basic [ES6 templating:](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) ```var tpl = `this is string ${a + b}` ```

### Simple properties
Which means you can use very same code **right in your html file**:

```html
<!-- tpl-article.html -->
<article>
    <h2>${newData.title}</h2>
</article>
```

Now get the file somewhere in your code, library usin `fetch` method to get file, so `templates.include` method return `Promise`:

```javascript
var myArticle = { title: 'Hellow World!' };
var main = document.querySelector('body');

templates.include('./tpl-article.html', myArticle)
    .then(tpl => main.innerHTML += tpl);
```

### Expressions
Now you can youse any expression inline:

```html
<div class="price">${newData.price * newData.coeff}.00</div>
```

### Functions
But whole power of this approach are in the functions. Here is simple repeat func:
```html
<div>
    ${(() => {
        var list = '';
        newData.map(item => {
            list += `
                <a href="${item.link}" class="title" title="${item.title}">${item.title}</a>
            `
        })
        return list
    })()}
</div>
```
### Client side Middlewares
Now middlewares can be used on client side
```javascript
import * as templates from 'es6templates.js';

var repl = (te) => {
  te = te.replace('class-to-remove', 'rp');
  return te
};
var test = templates.include('/tpl/list.html', list, repl);

test.then(html => console.log(html))
```
### Server side Middlewares
You can use any middleware fuctions to do even more with templates:
```javascript
import {default as markdown} from 'markdown-it';

//Define new middleware
templates.middlewares['markdown'] = function(raw) {
    return markdown.render(raw);
};

//fetching tpl
templates.include('./tpl-markdown.html', dataset, 'markdown').then(tpl => {
    console.log(tpl);
    //will output:
    // <p><a href="http://bajjy.com/assets/img/dwnld/package1.zip">download mockup</a></p>
    // <h2><a id="Foreword_1"></a>Foreword</h2>
    // <p>For many years I have been studying and using Photoshop features and tools.</p>
});
```
```html
<!-- tpl-markdown.html -->
[download mockup](http://bajjy.com/assets/img/dwnld/package1.zip)
## Foreword
For many years I have been studying and using Photoshop features and tools. 
```

## Examples
Look in `./test` folder. Thre must be a server for this folder. You can use tiny node server from same folder.

## Using of node server
```
node node-server.js [port]
```
