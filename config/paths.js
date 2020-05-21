const path = require(`path`)

module.exports = {
  src: path.resolve(__dirname, `../src`), // source files
  build: path.resolve(__dirname, `../build`), // production build files
  dist: path.resolve(__dirname, `../dist`), // static files to copy to build folder
}
