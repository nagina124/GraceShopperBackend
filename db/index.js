module.exports = {
    ...require('./users'), // adds key/values from users.js
    ...require('./products'), // adds key/values from activites.js
    ...require('./orders'), // etc
    ...require('./reviews') // etc
  }