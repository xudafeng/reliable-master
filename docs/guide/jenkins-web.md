# Jenkins Web Task

---

## Dependencies

### Docker

Just like reliable-web, we recommend to build web with Docker.

## Sample Project

- [web-app-bootstrap](//github.com/app-bootstrap/web-app-bootstrap)

## Quick Start

### Step1 - Create New

Create a new item named `web-app-bootstrap`, and select the `Freestyle project` mode.

<div align="center">
  <img src="https://wx2.sinaimg.cn/large/6d308bd9gy1ftc27q3vd3j21kw128tpk.jpg" width="75%" />
</div>

### Step2 - SCM Config

<div align="center">
  <img src="https://wx1.sinaimg.cn/large/6d308bd9gy1ftc27pr7xuj21kw128gzp.jpg" width="75%" />
</div>

Please input the `web-app-bootstrap` git url, and set the clone depth to `1`, branch to `master` is ok.

```
https://github.com/app-bootstrap/web-app-bootstrap.git
```

### Step3 - Build Scripts Config

**Noted**

- please confirm jenkins delete the workspace before build to avoid the old middle-file problem.

<div align="center">
  <img src="https://wx4.sinaimg.cn/large/6d308bd9gy1ftc27nq3rsj21kw12j7if.jpg" width="75%" />
</div>

We provide the webpack build docker like `macacajs/macaca-electron-docker`, so you can set the feild content like this:

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

**Noted**

- please confirm the `RELIABLE_SERVER_URL` has the correct address just like the IPV4 or some domain name which can be visited from the docker container, otherwise you will meet the problem below.

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

### Step4 - Build Now

After the building ready, you can get the final result from reliable-web.

<div align="center">
  <img src="https://wx4.sinaimg.cn/large/6d308bd9gy1ft3nqcab4vj21kw0xxwn0.jpg" width="75%" />
</div>

We cat get the build results of the `web-app-bootstrap`.

<div align="center">
  <img src="https://wx3.sinaimg.cn/large/6d308bd9gy1ft3nqcmte5j21kw0xxdm6.jpg" width="75%" />
</div>

You can also get other extra build infomation. If you want more, please tweak the [reliable-cli#configuration](//github.com/macacajs/reliable-cli#configuration) file.

### Step5 - Test Reporter

Reliable support the Unit and E2E test reporter, coverage based on Macaca is supported.

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
