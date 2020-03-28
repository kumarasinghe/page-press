<h1 align="center">PagePress - NodeJS Template Engine </h1>

## `page-press` takes static html file, plugs whatever you want inside and sends it to the web browser.

## Features:

- Lightweight & easy to use
- Caching support
- Localization support
- Works with express


## QUICK START

Prepare the frontend `index.html` page:

    <html>
        <body>
        <h1>greet-text</h1>
        </body>
    </html>

`greet-text` is a placeholder. It will be replaced by a value when the browser sees it.

Prepare the backend `index.js` file:

    const express = require('express')
    const app = express()

    const pagePress = require('page-press')
    app.use(pagePress)

    app.get('/', (req, res) => {

        let fileToServe = __dirname + '/index.html'
        res.render(
            fileToServe,                // template file
            {'greet-text':'Hello!'}     // placeholder bindings
        )

    })

    app.listen(80)

In `res.render()`  we first specify the template file, and then a JSON object with the values we wish to bind to placeholders in `index.html`.

Do `npm index.js` and visit http://localhost from your web browser.

## Adding multi-language support

Prepare your language file `index.html.lang` next to `index.html`:

    {
        "default":{
            "greet-text":"Hello!",
            "original text":"replacement text"
        },
        "sp":{
            "greet-text":"Hola!"
        },
        "jp":{
            "greet-text":"Konichiva!"
        }
    }

Pass your prefered language into the `res.render()`:

    res.render(
        fileToServe,    // template file
        {},             // placeholder bindings
        'sp'            // language
    )

PagePress will read the .lang file and fill the placeholder with the specified spanish value. If you do not specify the language in `res.render()`. Not specifying a language in `res.ender()` will make PagePress use `default` fields in the language file to fill html placeholders.