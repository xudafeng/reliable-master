'use strict';

const debug = require('debug')('reliable:reliable-dingtalk');
const ChatBot = require('dingtalk-robot-sender');

const sendMarkdown = async (options) => {
  debug(options);
  const robot = new ChatBot({
    webhook: options.webhook.url,
  });
  if (options.isRawMarkdown) {
    await robot.markdown(options.title, options.text);
    return;
  }
  await robot.markdown(options.title, options.text.join('\n\n'));
};

module.exports = {
  sendMarkdown,
  sendDingTalk: async function ({
    webhook,
    data,
    staticServerUrl,
    reliableServerUrl,
  }) {
    const {
      gitCommitInfo = {},
      environment = {},
      testInfo = {},
      packages = [],
    } = data;

    const { ci } = environment;

    const title = `[Reliable] **${ci.JOB_NAME}** build passed.`;

    // message body
    let text = [];
    const gitUrl = `${gitCommitInfo.gitUrl}`;
    text.push(`### Repository ${ci.JOB_NAME} build passed`);
    text.push('');
    text.push(`#### Platform: ${environment.platform}`);
    text.push('#### Commit');
    text.push(`[${gitCommitInfo.shortHash}](${gitUrl}/commit/${gitCommitInfo.hash}): ${gitCommitInfo.subject}`);
    text.push(`> committer:[@${gitCommitInfo.committer.name}]() author:[@${gitCommitInfo.author.name}]()`);

    // test report info

    text.push('#### Test report');
    const staticUrl = `${staticServerUrl}/jenkins/${ci.JOB_NAME}/${ci.BUILD_NUMBER}/`;
    const buildStaticPath = path => /^https?:\/\//.test(path) ? path : staticUrl + path;
    const passLogUrl = buildStaticPath(testInfo.testHtmlReporterPath);

    if (testInfo && testInfo.tests) {
      text.push(`> Test Cases: [(${testInfo.passes}/${testInfo.tests}) ${testInfo.passPercent}% passed](${passLogUrl})`);
    }

    const covUrl = buildStaticPath(testInfo.coverageHtmlReporterPath);

    if (testInfo && testInfo.linePercent) {
      text.push(`> Line Coverage: [${testInfo.linePercent}%](${covUrl})`);
    }

    // release
    text.push('#### Release');
    const pkgText = packages.map(i => i && `> [${i.type}-${i.version}](${buildStaticPath(i.path)})`);

    if (pkgText.length) {
      text = text.concat(pkgText);
    } else {
      text.push('> none');
    }

    if (ci.BUILD_NUMBER) {
      text.push(`[> See details on reliable-web](${reliableServerUrl}/buildinfo?jobName=${ci.JOB_NAME}&buildNumber=${ci.BUILD_NUMBER})`);
    }

    try {
      await sendMarkdown({
        webhook,
        title,
        text,
      });
    } catch (e) {
      console.log(e.stack);
    }
  }
};
