# Jenkins Android 任务配置

---

## 依赖准备

### 环境依赖

在 `reliable_home` 创建 `gradle_cache` 目录用于 Gradle 工具的缓存。

```bash
$ mkdir $HOME/reliable_home/gradle_cache
```

### Docker 部署

就像 reliable-web 一样，Reliable 环境配置倾向于容器化，推荐你使用 Android Docker 容器运行任务。

## 示例工程

[android-app-bootstrap](//github.com/app-bootstrap/android-app-bootstrap)

## 快速上手

### 第1步 - 创建任务

创建一个项目名为 `android-app-bootstrap`，并且选择自由风格模式。

<div align="center">
  <img src="https://wx3.sinaimg.cn/large/6d308bd9ly1ft2p8qmlazj21kw15ztol.jpg" width="75%" />
</div>

### 第2步 - SCM 配置

<div align="center">
  <img src="https://wx2.sinaimg.cn/large/6d308bd9ly1ft2panw2oqj21kw15znaj.jpg" width="75%" />
</div>

输入项目的 git 地址，并且选择克隆深度为 1，分支为 `master`。

```
https://github.com/app-bootstrap/android-app-bootstrap.git
```

### 第3步 - 构建脚本配置

<div align="center">
  <img src="https://wx3.sinaimg.cn/large/6d308bd9ly1ft2peam690j21kw15ztl8.jpg" width="75%" />
</div>

**注意**

- 请确保勾选构建前删除运行空间，以排除老的中间文件造成的问题。

<div align="center">
  <img src="https://wx3.sinaimg.cn/large/6d308bd9ly1ft2plz2djxj21kw16pk5j.jpg" width="75%" />
</div>

我们提供 Android 构建 Docker 镜像 `macacajs/macaca-android-build-docker`，你可以设置如下：

```
docker stop $JOB_NAME || true && docker rm -f $JOB_NAME || true

docker run --rm \
  --name $JOB_NAME \
  -e JOB_NAME \
  -e BUILD_NUMBER \
  -e RELIABLE_SERVER_URL=http://192.168.0.102:9900 \
  -v $WORKSPACE:/root/src \
  -v $HOME/reliable_home/static:/static \
  -v $HOME/reliable_home/gradle_cache:/root/.gradle \
  macacajs/macaca-android-build-docker
```

**注意**

- 也可以不使用容器而使用系统命令行直接进行构建。
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
npm ERR! android-app-bootstrap@1.0.8 reliable: `reliable report -c ./reliable.config.js`
npm ERR! Exit status 1
```

### 第4步 - 理解构建

<div align="center">
  <img src="https://wx2.sinaimg.cn/large/6d308bd9ly1ft2pvmld7dj21kw148wn3.jpg" width="75%" />
</div>

构建结束后，你可以在 reliable web 平台获得构建结果。

<div align="center">
  <img src="https://wx1.sinaimg.cn/large/6d308bd9ly1ft2pvmlnkij21kw148dph.jpg" width="75%" />
</div>

比如我们能够获得 `android-app-bootstrap` 的 `debug` 类型包和 `release` 类型包。

<div align="center">
  <img src="https://wx4.sinaimg.cn/large/6d308bd9ly1ft2pvmmewxj21kw14849j.jpg" width="75%" />
</div>

Reliable 平台也支持扫码下载安装等实用功能。

<div align="center">
  <img src="https://wx3.sinaimg.cn/large/6d308bd9ly1ft2pvmlz1hj21kw148tl3.jpg" width="75%" />
</div>

我们也可以获得项目配置，版本等额外信息。如果需要更多上报信息可以参考上报脚本文档 [reliable-cli#configuration](//github.com/macacajs/reliable-cli#configuration)。

### 第5步 - 自动化测试

Reliable 无缝集成 Macaca 自动化测试工具，支持通过率报告，端到端链路刻画，覆盖率等质量覆盖方案。

配置敬请期待！
