# Jenkins Android Task

---

## Dependencies

### Environment

Should create `gradle_cache` directory in reliable_home for gradle tool.

```bash
$ mkdir $HOME/reliable_home/gradle_cache
```

### Docker

Just like reliable-web, we recommend to build Android with Docker.

## Sample Project

[android-app-bootstrap](//github.com/app-bootstrap/android-app-bootstrap)

## Quick Start

### Step1 - Create New

Create a new item named `android-app-bootstrap`, and select the `Freestyle project` mode.

<div align="center">
  <img src="https://wx3.sinaimg.cn/large/6d308bd9ly1ft2p8qmlazj21kw15ztol.jpg" width="75%" />
</div>

### Step2 - SCM Config

<div align="center">
  <img src="https://wx2.sinaimg.cn/large/6d308bd9ly1ft2panw2oqj21kw15znaj.jpg" width="75%" />
</div>

Please input the `android-app-bootstrap` git url, and set the clone depth to `1`, branch to `master` is ok.

```
https://github.com/app-bootstrap/android-app-bootstrap.git
```

### Step3 - Build Scripts Config

<div align="center">
  <img src="https://wx3.sinaimg.cn/large/6d308bd9ly1ft2peam690j21kw15ztl8.jpg" width="75%" />
</div>

**Noted**

- please confirm jenkins delete the workspace before build to avoid the old middle-file problem.

<div align="center">
  <img src="https://wx3.sinaimg.cn/large/6d308bd9ly1ft2plz2djxj21kw16pk5j.jpg" width="75%" />
</div>

We provide the Android build docker like `macacajs/macaca-android-build-docker`, so you can set the feild content like this:

```
docker stop $JOB_NAME || true && docker rm -f $JOB_NAME || true

docker run --rm \
  --name $JOB_NAME \
  -e JOB_NAME \
  -e BUILD_NUMBER \
  -e reliable_SERVER_URL=http://192.168.0.102:9900 \
  -v $WORKSPACE:/root/src \
  -v $HOME/reliable_home/static:/static \
  -v $HOME/reliable_home/gradle_cache:/root/.gradle \
  macacajs/macaca-android-build-docker
```

**Noted**

- you can also build android out off the docker container, system shell command is ok.
- please confirm the `reliable_SERVER_URL` has the correct address just like the IPV4 or some domain name which can be visited from the docker container, otherwise you will meet the problem below.

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

### Step4 - Build Now

<div align="center">
  <img src="https://wx2.sinaimg.cn/large/6d308bd9ly1ft2pvmld7dj21kw148wn3.jpg" width="75%" />
</div>

After the building ready, you can get the final result from reliable-web.

<div align="center">
  <img src="https://wx1.sinaimg.cn/large/6d308bd9ly1ft2pvmlnkij21kw148dph.jpg" width="75%" />
</div>

We cat get the `debug` and `relese` package of the `android-app-bootstrap`.

<div align="center">
  <img src="https://wx4.sinaimg.cn/large/6d308bd9ly1ft2pvmmewxj21kw14849j.jpg" width="75%" />
</div>

Scan the QRCode, you can download and install it with your device.

<div align="center">
  <img src="https://wx3.sinaimg.cn/large/6d308bd9ly1ft2pvmlz1hj21kw148tl3.jpg" width="75%" />
</div>

You can also get other extra build infomation. If you want more, please tweak the [reliable-cli#configuration](//github.com/macacajs/reliable-cli#configuration) file.

### Step5 - Test Reporter

reliable support the Unit and E2E test reporter, coverage based on Macaca is supported.

coming soon
