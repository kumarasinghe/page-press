const fs = require('fs')
const path = require('path')
let cache = {}

/********************************** UTILITIES *********************************/

function cachedReadFileSync(filename) {

    // if file is in cache
    if (cache[filename]) {
        return cache[filename] + ''
    }
    // if file is not in cache => read from disk
    else {

        let fileContent = fs.readFileSync(filename)
        // add file to cache
        cache[filename] = fileContent
        return fileContent + ''

    }

}

/***************************** EXPRESS MIDDLEWARE *****************************/

function pagePress(req, res, next) {

    res.render = function (templateFilename, templateValues, langCode) {

        return new Promise((resolve) => {

            // read template file content
            let templateCode
            try {
                templateCode = cachedReadFileSync(templateFilename)
            } catch (err) {
                throw new Error('Unable to read template: ' + templateFilename)
            }

            // bind values to template
            for (key in templateValues) {

                let value = templateValues[key]

                templateCode = templateCode.replace(
                    new RegExp(key, 'g'),
                    value
                )

            }

            // localize
            if (fs.existsSync(templateFilename + '.lang')) {

                // read language file content
                if (langCode == undefined) { langCode = 'default' }
                let languageBinding

                try {
                    languageBinding = JSON.parse(cachedReadFileSync(templateFilename + '.lang'))[langCode]
                } catch (err) {
                    throw new Error('Error parsing the language file: ' + templateFilename + '.lang')
                }

                // if binding exists for the requested language
                if (languageBinding) {

                    // bind new language to template code
                    for (key in languageBinding) {

                        let value = languageBinding[key]

                        templateCode = templateCode.replace(
                            new RegExp(key, 'g'),
                            value
                        )

                    }
                }
            }

            res.end(templateCode)
            resolve()

        })

    }

    next()
}

module.exports = pagePress