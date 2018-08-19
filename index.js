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
    const issueComment = context.issue({ body: 'Thanks for opening this issue!' })
    const owner = getOwner(context)
    const repo = getRepo(context)
    /**
    * Fetch contents of readme.md containing
    * content in base64 format
    */
    const templateBody = await fetchJSON(
      `https://api.github.com/repos/${owner}/${repo}/contents/README.md`
    )
    context.log('issueBody', issueBody)
    var encoded = JSON.parse(templateBody)
    var bytes = base64.decode(encoded.content)
    console.log('templateBody', bytes)

    /* if (issueBody === templateBody) {
      context.log(context.payload.issue.body)
    } */
    return context.github.issues.createComment(issueComment)
  })

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
