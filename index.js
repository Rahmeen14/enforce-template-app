const {
  fetchJSON,
  getOwner,
  getRepo,
  getComment,
  isBodyFollowingTemplate,
  getFinalComment,
  parseBody
} = require('./util')
/**
 * This is the entry point for your Probot App.
 * @param {import('probot').Application} app - Probot's Application class.
 */
module.exports = app => {
  app.log('Yay, the app was loaded!')

  app.on('issues.opened', async context => {
    const issueBody = (context.payload.issue.body)
    const issueCommentOnSuccess = getComment(context, 'Thank you for opening this issue')
    const issueCommentOnFailure = getComment(context, 'Please abide by the template ISSUE_TEMPLATE.md while opening issues')
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
    const templateFields = parseBody(templateBody)
    /**
     * Checks for occurance of every template field in the
     * issue body and returns an appropriate comment based
     * on the flag value
     */
    return getFinalComment(context, isBodyFollowingTemplate(templateFields, true, issueBody), issueCommentOnSuccess, issueCommentOnFailure)
  })

  app.on('pull_request.opened', async context => {
    const pullRequestBody = (context.payload.pull_request.body)
    const pullRequestCommentOnSuccess = getComment(context, 'Thank you for the pull request')
    const pullRequestCommentOnFailure = getComment(context, 'Please abide by the template PULL_REQUEST_TEMPLATE.md while raising PRs')
    const owner = getOwner(context)
    const repo = getRepo(context)
    /**
    * Fetch contents of ISSUE_TEMPLATE.md containing
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
    const templateFields = parseBody(templateBody)
    /**
     * Checks for occurance of every template field in the
     * issue body and returns an appropriate comment based
     * on the flag value
     */
    return getFinalComment(context, isBodyFollowingTemplate(templateFields, true, pullRequestBody), pullRequestCommentOnSuccess, pullRequestCommentOnFailure)
  })
  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
