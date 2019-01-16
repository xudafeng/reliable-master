# Integrate With Gitlab CI

---

> GitLab is a single application for the entire DevOps lifecycle.

## Configuration

Set `RELIABLE_SERVER_URL` on demand.

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

[gitlab]: https://about.gitlab.com/install/
