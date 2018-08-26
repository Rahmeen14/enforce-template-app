const {
  fetchJSON,
  getOwner,
  getRepo
} = require('./util')
/**
 * This is the entry point for your Probot App.
 * @param {import('probot').Application} app - Probot's Application class.
 */
var base64 = require('base-64')
module.exports = app => {
  // Your code here
  app.log('Yay, the app was loaded!')

  app.on('issues.opened', async context => {
    const issueBody = (context.payload.issue.body)
    const issueCommentOnSuccess = context.issue({ body: 'Thanks for opening this issue!' })
    const issueCommentOnFailure = context.issue({ body: 'Please abide by the template while opening an issue' })
    const owner = getOwner(context)
    const repo = getRepo(context)
    /**
    * Fetch contents of readme.md containing
    * content in base64 format
    */
    const templateBody = await fetchJSON(
      `https://api.github.com/repos/${owner}/${repo}/contents/ISSUE_TEMPLATE.md`
    )
    context.log('issueBody', issueBody)
    var encoded = JSON.parse(templateBody)
    var bytes = base64.decode(encoded.content)
    console.log('templateBody', bytes)

    /* if (issueBody === templateBody) {
      context.log(context.payload.issue.body)
    } */
    var lines = bytes.toString().split('\n')
    // console.log(lines.length)
    var isFollowingTemplate = true
    for (var i = 0; i < lines.length; i++) {
      if (issueBody.includes(lines[i])) {
        continue
      }
      isFollowingTemplate = (lines[i].includes('* [ ]')
      ? [lines[i], lines[i].replace('* [ ]', '* [x]')].some(l => issueBody.includes(l))
      : issueBody.includes(lines[i])) ||
      (lines[i].includes('- [ ]')
      ? [lines[i], lines[i].replace('- [ ]', '- [x]')].some(l => issueBody.includes(l))
      : issueBody.includes(lines[i]))
      if (!isFollowingTemplate) {
        break
      }
    }
    return isFollowingTemplate
    ? context.github.issues.createComment(issueCommentOnSuccess)
    : context.github.issues.createComment(issueCommentOnFailure)
  })

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
