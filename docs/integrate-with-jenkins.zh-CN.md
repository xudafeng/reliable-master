# Jenkins 集成文档

---

## Reliable home 目录

在配置前需要创建 `reliable_home` 目录。

```bash
$ mkdir $HOME/reliable_home
```

`reliable_home` 包含以下子目录。

```
.
├── static                               提供静态资源下载服务
├── mysql_data                           Mysql 数据库存档
├── jenkins_home                         Jenkins home 目录
├── jenkins_tmp                          Jenkins 临时文件目录
└── jenkins.war                          Jenkins war 包执行文件
```

## 部署 Jenkins

- 在 `$HOME/reliable_home` 目录创建 `jenkins_home` 和 `jenkins_tmp`
- 下载 [War 包](http://mirrors.jenkins.io/) 到 `$HOME/reliable_home`
- Jenkins 服务启动在 9910 端口

```bash
$ java -Dfile.encoding=UTF-8 \
  -XX:PermSize=256m \
  -XX:MaxPermSize=512m \
  -Xms256m \
  -Xmx512m \
  -DJENKINS_HOME=$HOME/reliable_home/jenkins_home \
  -Djava.io.tmpdir=$HOME/reliable_home/jenkins_tmp \
  -jar $HOME/reliable_home/jenkins.war \
  --httpPort=9910
```

修改 `$HOME/reliable_home/jenkins_home/config.xml` 文件中的配置字段 `useSecurity` 为 false，并且重启 Jenkins 服务。

```xml
<useSecurity>false</useSecurity>
```

0. 输入 `initialAdminPassword` 管理员密码
0. 选择 `Install suggested plugins` 推荐模式安装 Jenkins 插件。

---

## 构建任务配置

- [jenkins-android.zh-CN.md](./jenkins-android.zh-CN.md)
- [jenkins-ios.zh-CN.md](./jenkins-ios.zh-CN.md)
- [jenkins-web.zh-CN.md](./jenkins-web.zh-CN.md)
