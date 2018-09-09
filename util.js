const fetch = require('node-fetch')
var base64 = require('base-64')
const ISSUE_TEMPLATE_SUCCESS_MESSAGE = 'Thank you for opening this issue'
const ISSUE_TEMPLATE_FAILURE_MESSAGE =
  'Please abide by the template ISSUE_TEMPLATE.md while opening issues'
const PULL_REQUEST_TEMPLATE_SUCCESS_MESSAGE = 'Thank you for the pull request'
const PULL_REQUEST_TEMPLATE_FAILURE_MESSAGE =
  'Please abide by the template PULL_REQUEST_TEMPLATE.md while raising PRs'
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
 * @param {string} templateBody
 * @return {Array} an array of template fields
 */
const parseBody = templateBody => {
  let encoded = JSON.parse(templateBody)
  return getTemplateFields(base64.decode(encoded.content))
}
/**
 * @param {Context} context
 * @return {string} repo name
 *
 */
const getRepo = context => context.payload.repository.name

/**
 * @param {Context} context
 * @param {string} message
 * @return {object} comment body
 *
 */
const getComment = (context, message) => context.issue({ body: message })

/**
 * @param {string} templateField
 * @param {object} bodyText
 * @return {boolean} whether issue/PR body contains the given templateField
 *
 */
const isFollowingTemplate = (templateField, bodyText) => {
  if (bodyText.includes(templateField)) {
    return true
  }
  // Handles radio button markdown
  return (
    (templateField.includes('* [ ]')
      ? [templateField, templateField.replace('* [ ]', '* [x]')].some(l =>
          bodyText.includes(l)
        )
      : bodyText.includes(templateField)) ||
    (templateField.includes('- [ ]')
      ? [templateField, templateField.replace('- [ ]', '- [x]')].some(l =>
          bodyText.includes(l)
        )
      : bodyText.includes(templateField))
  )
}

/**
 * @param {base64} templateBytes
 * @return {Array} string array of template fields
 *
 */
const getTemplateFields = templateBytes => templateBytes.toString().split('\n')

/**
 * @param {Array} templateFields
 * @param {boolean} followsTemplateBoolean
 * @param {object} bodyText
 * @return {boolean} whether the issue/PR body follow the template
 */
const isBodyFollowingTemplate = (
  templateFields,
  followsTemplateBoolean,
  bodyText
) =>
  templateFields.every(t => isFollowingTemplate(t, bodyText)) ||
  followsTemplateBoolean
/**
 * @param {Context} context
 * @param {boolean} isFollowingTemplate
 * @param {object} commentOnSuccess
 * @param {object} commentOnFailure
 * @return {object} final comment to be displayed eventually
 *
 */
const getFinalComment = (
  context,
  isFollowingTemplate,
  commentOnSuccess,
  commentOnFailure
) =>
  context.github.issues.createComment(
    isFollowingTemplate ? commentOnSuccess : commentOnFailure
  )
exports.ISSUE_TEMPLATE_FAILURE_MESSAGE = ISSUE_TEMPLATE_FAILURE_MESSAGE
exports.ISSUE_TEMPLATE_SUCCESS_MESSAGE = ISSUE_TEMPLATE_SUCCESS_MESSAGE
exports.PULL_REQUEST_TEMPLATE_FAILURE_MESSAGE = PULL_REQUEST_TEMPLATE_FAILURE_MESSAGE
exports.PULL_REQUEST_TEMPLATE_SUCCESS_MESSAGE = PULL_REQUEST_TEMPLATE_SUCCESS_MESSAGE
exports.getTemplateFields = getTemplateFields
exports.getFinalComment = getFinalComment
exports.isFollowingTemplate = isFollowingTemplate
exports.isBodyFollowingTemplate = isBodyFollowingTemplate
exports.getComment = getComment
exports.fetchJSON = fetchJSON
exports.getOwner = getOwner
exports.getRepo = getRepo
exports.parseBody = parseBody
