const fs = require('fs')
const path = require('path')
let cache = {}

/***************************** EXPRESS MIDDLEWARE *****************************/
function pagePress(req, res, next) {

    res.render = function (templateFilename, valueBindingsJSON, langCode) {

        if (langCode == undefined) { langCode = 'default' }

        return new Promise((resolve, reject) => {

            try {

                let templateSrc

                // try getting the template source copy from cache
                if (cache[templateFilename + langCode]) {
                    templateSrc = cache[templateFilename + langCode] + ''
                }
                // template not cached. read from the disk.
                else {
                    // read template from disk
                    templateSrc = fs.readFileSync(templateFilename, { encoding: 'utf8' })

                    // if language file available
                    let languageFilename = templateFilename + '.lang'
                    if (fs.existsSync(languageFilename)) {

                        // plug language bindings to template
                        let languageBindingsJSON = JSON.parse(fs.readFileSync(languageFilename))[langCode]

                        // if language available
                        if (languageBindingsJSON) {

                            for (key in languageBindingsJSON) {
                                templateSrc = templateSrc.replace(
                                    new RegExp('{' + key + '}', 'g'),
                                    languageBindingsJSON[key]
                                )
                            }

                        }

                    }

                    // cache the template for future use
                    cache[templateFilename + langCode] = templateSrc + ''
                }

                // plug json values to template placeholders
                for (key in valueBindingsJSON) {
                    templateSrc = templateSrc.replace(
                        new RegExp('{' + key + '}', 'g'),
                        valueBindingsJSON[key]
                    )
                }

                res.end(templateSrc)
                resolve()

            } catch (err) {
                reject(err)
            }

        })

    }

    next()
}

module.exports = pagePress