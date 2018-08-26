const {
  fetchJSON,
  getOwner,
  getRepo,
  getCommentOnSuccess,
  getCommentOnFailure,
  isIssueFollowingTemplate,
  getTemplateFields
} = require('./util')
/**
 * This is the entry point for your Probot App.
 * @param {import('probot').Application} app - Probot's Application class.
 */
var base64 = require('base-64')
module.exports = app => {
  app.log('Yay, the app was loaded!')

  app.on('issues.opened', async context => {
    const issueBody = (context.payload.issue.body)
    const issueCommentOnSuccess = getCommentOnSuccess(context)
    const issueCommentOnFailure = getCommentOnFailure(context)
    const owner = getOwner(context)
    const repo = getRepo(context)
    /**
    * Fetch contents of ISSUE_TEMPLATE.md containing
    * content in base64 format
    */
    const templateBody = await fetchJSON(
      `https://api.github.com/repos/${owner}/${repo}/contents/ISSUE_TEMPLATE.md`
    )
   /**
    * Parse the fetched JSON issue template and
    * extract all fields from it for comparasion
    * against the issue body
    */
    let encoded = JSON.parse(templateBody)
    let templateBytes = base64.decode(encoded.content)
    const templateFields = getTemplateFields(templateBytes)
    /**
     * A boolean to flag the violation of issue template
     */
    let isFollowingTemplate = true
    /**
     * Checks for occurance of every template field in the
     * issue body and returns an appropriate comment based
     * on the flag value
     */
    templateFields.forEach(function (templateField) {
      if (!isIssueFollowingTemplate(templateField, issueBody)) {
        isFollowingTemplate = false
      }
    })
    return isFollowingTemplate
    ? context.github.issues.createComment(issueCommentOnSuccess)
    : context.github.issues.createComment(issueCommentOnFailure)
  })

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
