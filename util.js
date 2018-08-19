const fetch = require('node-fetch')

/**
 * @param {string} url
 * @param {object} [options] as accepted by `fetch`
 * @returns {Promise<object>} promise resolving into JSON object
 */
const fetchJSON = (url, options = {}) =>
  fetch(url, options).then(res => res.text())

/**
 * @param {Context} context
 * @return {string} owner name
 *
 */
const getOwner = context => context.payload.repository.owner.login

/**
 * @param {Context} context
 * @return {string} repo name
 *
 */
const getRepo = context => context.payload.repository.name

/**
 * @param {Context} context
 * @return {string} userName of the commenter
 *
 */

exports.fetchJSON = fetchJSON
exports.getOwner = getOwner
exports.getRepo = getRepo
