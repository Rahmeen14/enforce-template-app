const {
  fetchJSON,
  getOwner,
  getRepo,
  getComment,
  isBodyFollowingTemplate,
  getFinalComment,
  parseBody,
  ISSUE_TEMPLATE_FAILURE_MESSAGE,
  ISSUE_TEMPLATE_SUCCESS_MESSAGE,
  PULL_REQUEST_TEMPLATE_SUCCESS_MESSAGE,
  PULL_REQUEST_TEMPLATE_FAILURE_MESSAGE
} = require('./util')
/**
 * This is the entry point for your Probot App.
 * @param {import('probot').Application} app - Probot's Application class.
 */
module.exports = app => {
  app.log('Yay, the app was loaded!')

  app.on('issues.opened', async context => {
    const issueBody = context.payload.issue.body
    const issueCommentOnSuccess = getComment(
      context,
      ISSUE_TEMPLATE_SUCCESS_MESSAGE
    )
    const issueCommentOnFailure = getComment(
      context,
      ISSUE_TEMPLATE_FAILURE_MESSAGE
    )
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
    let templateFields = []
    try {
      templateFields = parseBody(templateBody)
    } catch (err) {
      console.error(err)
    }
    /**
     * Checks for occurance of every template field in the
     * issue body and returns an appropriate comment based
     * on whether the template is abided by
     */
    return getFinalComment(
      context,
      isBodyFollowingTemplate(templateFields, false, issueBody),
      issueCommentOnSuccess,
      issueCommentOnFailure
    )
  })

  app.on('pull_request.opened', async context => {
    const pullRequestBody = context.payload.pull_request.body
    const pullRequestCommentOnSuccess = getComment(
      context,
      PULL_REQUEST_TEMPLATE_SUCCESS_MESSAGE
    )
    const pullRequestCommentOnFailure = getComment(
      context,
      PULL_REQUEST_TEMPLATE_FAILURE_MESSAGE
    )
    const owner = getOwner(context)
    const repo = getRepo(context)
    /**
     * Fetch contents of PULL_REQUEST_TEMPLATE.md containing
     * content in base64 format
     */
    const templateBody = await fetchJSON(
      `https://api.github.com/repos/${owner}/${repo}/contents/PULL_REQUEST_TEMPLATE.md`
    )
    /**
     * Parse the fetched JSON pull request template and
     * extract all fields from it for comparasion
     * against the PR body
     */
    let templateFields = []
    try {
      templateFields = parseBody(templateBody)
    } catch (err) {
      console.error(err)
    }
    /**
     * Checks for occurance of every template field in the
     * PR body and returns an appropriate comment based
     * on whether the template is abided by
     */
    return getFinalComment(
      context,
      isBodyFollowingTemplate(templateFields, false, pullRequestBody),
      pullRequestCommentOnSuccess,
      pullRequestCommentOnFailure
    )
  })
  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
