# enforce-template-app
### 2nd app by RGSoC team $we init

## Statement : 
* The Bot will require new Issues and PRs to use the respective templates and fill out their
fields automatically.
* It will check that the template was actually used instead of deleted by ensuring that
keywords are present in the body, along with placeholders which were replaced with
user text.

## Details of Implementation :
* The repository on which the bot is to be installed is required to contain an ISSUE_TEMPLATE.md file as well as a PULL_REQUEST_TEMPLATE.md file
* Upon the opening of an issue or a pull request, the bot is triggered to do the following.
* It reads the template accordingly (based on whether it is an issue or a pull request that was opened) and then stores the fields present in the template in an array.
* Then it takes the issue body and checks for the occurance of each of element of the array of template fields in the issue body.
* It also handles check-boxes markdown which are commonly used in PR templates

## Future Scope :
* We want to enforce certain mandatory fields to necssarily contain some content
* We also want to ensure that the content filled against these fields is relevent and not some random gibberish.