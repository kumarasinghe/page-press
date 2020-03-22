const express = require('express')
const app = express()

const pagePress = require('page-press')
app.use(pagePress)

app.get('/', (req, res) => {

    res.render(
        __dirname + '/index.html',  // template file
        {},                         // placeholder bindings
        'jp'                        // language
    )

})

app.listen(80, ()=>{console.log('Go to http://localhost from your web browser.')})