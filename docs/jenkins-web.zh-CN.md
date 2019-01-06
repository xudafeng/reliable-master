# Jenkins Web 任务配置

---

## 依赖准备

### Docker 部署

就像 reliable-web 一样，Reliable 环境配置倾向于容器化，推荐你使用 Android Docker 容器运行任务。

## 示例工程

- [web-app-bootstrap](//github.com/app-bootstrap/web-app-bootstrap)

## 快速上手

### 第1步 - 创建任务

Create a new item named `web-app-bootstrap`, and select the `Freestyle project` mode.

<div align="center">
  <img src="https://wx2.sinaimg.cn/large/6d308bd9gy1ftc27q3vd3j21kw128tpk.jpg" width="75%" />
</div>

### 第2步 - SCM 配置

<div align="center">
  <img src="https://wx1.sinaimg.cn/large/6d308bd9gy1ftc27pr7xuj21kw128gzp.jpg" width="75%" />
</div>

Please input the `web-app-bootstrap` git url, and set the clone depth to `1`, branch to `master` is ok.

```
https://github.com/app-bootstrap/web-app-bootstrap.git
```

### 第3步 - 构建脚本配置

**注意**

- 请确保勾选构建前删除运行空间，以排除老的中间文件造成的问题。

<div align="center">
  <img src="https://wx4.sinaimg.cn/large/6d308bd9gy1ftc27nq3rsj21kw12j7if.jpg" width="75%" />
</div>

我们提供 Web 构建 Docker 镜像 `macacajs/macaca-electron-docker`，你可以设置如下：

```
docker stop $JOB_NAME || true && docker rm $JOB_NAME || true

docker run --rm \
  --name $JOB_NAME \
  -e JOB_NAME \
  -e BUILD_NUMBER \
  -e RELIABLE_SERVER_URL=http://129.168.1.102:9900 \
  -v $HOME/reliable_home/static:/static \
  -v $WORKSPACE:/root/src \
  macacajs/macaca-electron-docker \
  bash -c "cd /root/src && npm run ci"
```

**注意**

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
npm ERR! web-app-bootstrap@1.0.8 reliable: `reliable report -c ./reliable.config.js`
npm ERR! Exit status 1
```

### 第4步 - 立即构建

构建结束后，你可以在 reliable web 平台获得构建结果。

<div align="center">
  <img src="https://wx4.sinaimg.cn/large/6d308bd9gy1ft3nqcab4vj21kw0xxwn0.jpg" width="75%" />
</div>

We cat get the build results of the `web-app-bootstrap`.

<div align="center">
  <img src="https://wx3.sinaimg.cn/large/6d308bd9gy1ft3nqcmte5j21kw0xxdm6.jpg" width="75%" />
</div>

我们也可以获得项目配置，版本等额外信息。如果需要更多上报信息可以参考上报脚本文档 [reliable-cli#configuration](//github.com/macacajs/reliable-cli#configuration)。

### 第5步 - 自动化测试

Reliable 无缝集成 Macaca 自动化测试工具，支持通过率报告，端到端链路刻画，覆盖率等质量覆盖方案。

<div align="center">
  <img src="https://wx4.sinaimg.cn/large/6d308bd9gy1ft3nqbd9e3j21kw0xx45p.jpg" width="75%" />
</div>

<div align="center">
  <img src="https://wx3.sinaimg.cn/large/6d308bd9gy1ft3nqbgjesj21kw0xx7ee.jpg" width="75%" />
</div>

<div align="center">
  <img src="https://wx2.sinaimg.cn/large/6d308bd9gy1ft3nqbnft5j21kw0xxaq1.jpg" width="75%" />
</div>

<div align="center">
  <img src="https://wx1.sinaimg.cn/large/6d308bd9gy1ft3nqd3c7fj21kw0xxqcj.jpg" width="75%" />
</div>

<div align="center">
  <img src="https://wx2.sinaimg.cn/large/6d308bd9gy1ft3nqcraoij21kw0xxjyt.jpg" width="75%" />
</div>
