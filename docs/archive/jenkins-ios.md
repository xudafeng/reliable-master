# Jenkins iOS Task

---

## Dependencies

### Environment

Please install reliable-ios automation utils with following command.

```bash
$ curl -fsSL https://github.com/macacajs/reliable-ios/files/2114440/Makefile.txt -o Makefile && make init
```

## Sample Project

There are two sample projects, one for publish app and the other for publish private cocoapod pod frameworks:

- [ios-app-bootstrap - publish iOS App](//github.com/app-bootstrap/ios-app-bootstrap)
- [publish cocoapod frameworks](//github.com/macacajs/reliable-ios/tree/master/Example)

## Quick Start

### Step1 - Create New

Create a new item named `ios-app-bootstrap`, and select the `Freestyle project` mode.

<div align="center">
  <img src="https://wx2.sinaimg.cn/large/6d308bd9gy1ft3id6n0ajj21kw12rduv.jpg" width="75%" />
</div>

### Step2 - SCM Config

<div align="center">
  <img src="https://wx1.sinaimg.cn/large/6d308bd9gy1ft3id6gbmej21kw12r7hb.jpg" width="75%" />
</div>

Please input the `ios-app-bootstrap` git url, and set the clone depth to `1`, branch to `master` is ok.

```
https://github.com/app-bootstrap/ios-app-bootstrap.git
```

### Step3 - Build Scripts Config

<div align="center">
  <img src="https://wx4.sinaimg.cn/large/6d308bd9gy1ft3jq4frzjj21kw10nqek.jpg" width="75%" />
</div>

```
RELIABLE_SERVER_URL=http://127.0.0.1:9900 RELIABLE_IOS=true ./ci.sh
```

**Noted**

- To release the app and sign, you may need to configure your developer certificate in Jenkins.
- please confirm the RELIABLE_SERVER_URL has the correct address just like the IPV4 or some domain name which can be visited from the docker container, otherwise you will meet the problem below.

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

### Step4 - Build Now

<div align="center">
  <img src="https://wx1.sinaimg.cn/large/6d308bd9gy1ft3jw0q7o0j21kw10ndql.jpg" width="75%" />
</div>

After the building ready, you can get the final result from reliable-web.

<div align="center">
  <img src="https://wx1.sinaimg.cn/large/6d308bd9gy1ft3jw2iloqj21kw10nguj.jpg" width="75%" />
</div>

We cat get the `debug` package of the `ios-app-bootstrap`.

<div align="center">
  <img src="https://wx2.sinaimg.cn/large/6d308bd9gy1ft3jw318grj21kw10nwp4.jpg" width="75%" />
</div>

Scan the QRCode, you can download and install it with your device.

<div align="center">
  <img src="https://wx4.sinaimg.cn/large/6d308bd9gy1ft3jw32rz0j21kw10ntma.jpg" width="75%" />
</div>

You can also get other extra build infomation. If you want more, please tweak the [reliable-cli#configuration](//github.com/macacajs/reliable-cli#configuration) file.

### Step5 - Test Reporter

Reliable support the Unit and E2E test reporter, coverage based on Macaca is supported.

<div align="center">
  <img src="https://wx2.sinaimg.cn/large/6d308bd9gy1ftc4y26xzaj21kw10g12f.jpg" width="75%" />
</div>

<div align="center">
  <img src="https://wx2.sinaimg.cn/large/6d308bd9gy1ftc4y31cf5j21kw10g7kz.jpg" width="75%" />
</div>
