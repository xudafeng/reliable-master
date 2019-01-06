# Jenkins iOS 任务配置

---

## 依赖准备

### 环境依赖

请安装 reliable-ios 自动化脚本工具集。

```bash
$ curl -fsSL https://github.com/macacajs/reliable-ios/files/2114440/Makefile.txt -o Makefile && make init
```

## 示例项目

这里有两个示例工程，一个典型的 iOS 工程，另一个是发布私有 cocoapod pod 框架：

- [ios-app-bootstrap - publish iOS App](//github.com/app-bootstrap/ios-app-bootstrap)
- [publish cocoapod frameworks](//github.com/macacajs/reliable-ios/tree/master/Example)

## 快速上手

### 第1步 - 创建任务

创建一个项目名为 `ios-app-bootstrap`，并且选择自由风格模式。

<div align="center">
  <img src="https://wx2.sinaimg.cn/large/6d308bd9gy1ft3id6n0ajj21kw12rduv.jpg" width="75%" />
</div>

### 第2步 - SCM 配置

<div align="center">
  <img src="https://wx1.sinaimg.cn/large/6d308bd9gy1ft3id6gbmej21kw12r7hb.jpg" width="75%" />
</div>

输入项目的 git 地址，并且选择克隆深度为 1，分支为 `master`。

```
https://github.com/app-bootstrap/ios-app-bootstrap.git
```

### 第3步 - 构建脚本配置

<div align="center">
  <img src="https://wx4.sinaimg.cn/large/6d308bd9gy1ft3jq4frzjj21kw10nqek.jpg" width="75%" />
</div>

```
RELIABLE_SERVER_URL=http://127.0.0.1:9900 RELIABLE_IOS=true ./ci.sh
```

**注意**

- 为了能够直接扫码安装应用，请在 Jenkins 配置开发者证书签名。
- 请确认 `RELIABLE_SERVER_URL` 已经正确配置，可以是一个 IPV4 或者某个 url，否则会遇到如下问题：

```
error: TypeError: Cannot read property 'server' of undefined
    at _.postToGW (/root/src/node_modules/reliable-cli/lib/helper.js:31:66)
    at ReportCommand.pushToWebhook (/root/src/node_modules/reliable-cli/lib/report-command.js:130:18)
    at ReportCommand._run (/root/src/node_modules/reliable-cli/lib/report-command.js:70:35)
    at <anonymous>
    at process._tickCallback (internal/process/next_tick.js:188:7)
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! ios-app-bootstrap@1.0.11 reliable: `reliable report -c ./reliable.config.js`
npm ERR! Exit status 1
```

### 第4步 - 立即构建

<div align="center">
  <img src="https://wx1.sinaimg.cn/large/6d308bd9gy1ft3jw0q7o0j21kw10ndql.jpg" width="75%" />
</div>

构建结束后，你可以在 reliable web 平台获得构建结果。

<div align="center">
  <img src="https://wx1.sinaimg.cn/large/6d308bd9gy1ft3jw2iloqj21kw10nguj.jpg" width="75%" />
</div>

比如我们能够获得 `ios-app-bootstrap` 的 `debug` 类型包。

<div align="center">
  <img src="https://wx2.sinaimg.cn/large/6d308bd9gy1ft3jw318grj21kw10nwp4.jpg" width="75%" />
</div>

Reliable 平台也支持扫码下载安装等实用功能。

<div align="center">
  <img src="https://wx4.sinaimg.cn/large/6d308bd9gy1ft3jw32rz0j21kw10ntma.jpg" width="75%" />
</div>

我们也可以获得项目配置，版本等额外信息。如果需要更多上报信息可以参考上报脚本文档 [reliable-cli#configuration](//github.com/macacajs/reliable-cli#configuration)。

### 第5步 - 自动化测试

Reliable 无缝集成 Macaca 自动化测试工具，支持通过率报告，端到端链路刻画，覆盖率等质量覆盖方案。

<div align="center">
  <img src="https://wx2.sinaimg.cn/large/6d308bd9gy1ftc4y26xzaj21kw10g12f.jpg" width="75%" />
</div>

<div align="center">
  <img src="https://wx2.sinaimg.cn/large/6d308bd9gy1ftc4y31cf5j21kw10g7kz.jpg" width="75%" />
</div>
