# Gitlab CI 集成

---

## GitLab-CI 配置

最简单的配置如下：

其中 RELIABLE_SERVER_URL 按照具体上报的 Reliable 事例地址。

```yaml
before_script:
  - export MARMOT_SERVER_URL=http://reliable-host
  - export PATH=$PWD/node_modules/.bin:$PATH
  - echo $PATH
test:
  image: macacajs/macaca-electron-docker
  script:
    - npm i reliable-cli
    - reliable report
  tags:
    - swarm
```
