/* globals describe, it, expect */
const {
    isIssueFollowingTemplate
} = require('../util')
const issueTemplateFields = ['* [ ] Refactored', '**Steps to reproduce**', '## Feature Request', '- [ ] Presubmit']
describe('isIssueFollowingTemplate()', () => {
  it('returns true for "* [ ] Refactored"', () => {
    const result = isIssueFollowingTemplate(issueTemplateFields[0],
      createCommentBody('* [ ] Refactored'))
    expect(result).toBe(true)
  })
  it('returns true for "* [x] Refactored"', () => {
    const result = isIssueFollowingTemplate(issueTemplateFields[0],
      createCommentBody('* [x] Refactored'))
    expect(result).toBe(true)
  })
  it('returns true for "**Steps to reproduce**"', () => {
    const result = isIssueFollowingTemplate(issueTemplateFields[1],
      createCommentBody('**Steps to reproduce**'))
    expect(result).toBe(true)
  })
  it('returns true for "## Feature Request"', () => {
    const result = isIssueFollowingTemplate(issueTemplateFields[2],
      createCommentBody('## Feature Request'))
    expect(result).toBe(true)
  })
  it('returns true for "- [ ] Presubmit"', () => {
    const result = isIssueFollowingTemplate(issueTemplateFields[3],
      createCommentBody('- [ ] Presubmit'))
    expect(result).toBe(true)
  })
  it('returns true for "- [x] Presubmit"', () => {
    const result = isIssueFollowingTemplate(issueTemplateFields[3],
      createCommentBody('- [x] Presubmit'))
    expect(result).toBe(true)
  })
})

/**
 * Creates the context object based on the body passed
 * @param {string} body of the comment
 * @returns {Context} object with comment of same body
 */
const createCommentBody = body => ({
  payload: {
    comment: {
      body: body
    }
  }
})
