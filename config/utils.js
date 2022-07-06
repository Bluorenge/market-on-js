const path = require('path')
const fs = require('fs')

module.exports = {
    excludeNodeModulesExcept: function excludeNodeModulesExcept(modules) {
        var pathSep = path.sep
        if (pathSep === '\\') {
            pathSep = '\\\\'
        }
        var moduleRegExps = modules.map(modName => {
            return new RegExp('node_modules' + pathSep + modName)
        })

        return function (modulePath) {
            if (/node_modules/.test(modulePath)) {
                for (var i = 0; i < moduleRegExps.length; i++) {
                    if (moduleRegExps[i].test(modulePath)) {
                        return false
                    }
                }
                return true
            }
            return false
        }
    },

    processNestedHtml: (content, loaderContext) =>
        content.replace(/@@include\('(.+)\s*\/?'\)?/gi, (m, src) => {
            const filePath = path.resolve(loaderContext.context, src)
            loaderContext.dependency(filePath)
            return fs.readFileSync(filePath, 'utf8')
        }),
}
