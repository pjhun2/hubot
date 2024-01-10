// Octokit.js
// https://github.com/octokit/core.js#readme
const { Octokit } = require('@octokit/core')
const Conversation = require('hubot-conversation')

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
})

module.exports = function (robot) {

  const switchBoard = new Conversation(robot)

  robot.respond(/1/, function (msg) {
    const dialog = switchBoard.startDialog(msg, 30000, 'Timed out!, please start again.')

    const infoType = {
      phase: "",
      repo: ""
    }

    msg.reply('Sure, where should I start? Kitchen or Bathroom')
    dialog.addChoice(/kitchen/i, function (msg2) {
      msg2.reply('On it boss!')
    })
    dialog.addChoice(/2/i, function (msg2) {
      infoType.phase = "prod"
      msg.reply('Do I really have to?')
      dialog.addChoice(/3/, function (msg3) {
        return octokit.request('GET /orgs/{org}/repos', {
          org: 'LP-FINYL',
          headers: {
            'X-GitHub-Api-Version': '2022-11-28'
          }
        }).then((result) => {
          msg3.reply(`
          *가게 정보:*
\`\`\`
가게 이름: ${result.data[0].name}
정보: ${infoType.phase || 'N/A'}
\`\`\`
          `)
        })
      })
    })
  })

  robot.hear(/github repo/i, function (res) {
    return octokit.request('GET /orgs/{org}/repos', {
      org: 'LP-FINYL',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    }).then((result) => {
      return res.send(result.data[0].name)
    })
  })
  robot.respond(/open the pod bay doors/i, function (res) {
    return res.reply('I\'m afraid I can\'t let you do that.')
  })
  return robot.hear(/I like pie/i, function (res) {
    return res.emote('makes a freshly baked pie')
  })
}