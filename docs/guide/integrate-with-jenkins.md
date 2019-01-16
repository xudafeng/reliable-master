# Integrate With Jenkins

---

## Reliable home path

```bash
$ mkdir $HOME/reliable_home
```

reliable_home requires the following sub-directories to be created.

```
.
├── static                               Static HTTP server root folder, containing build artifacts, reports, and archived files.
├── mysql_data                           Mysql Database. Can be backed up easily.
├── jenkins_home                         Jenkins root folder, containing configuration files and plugins.
├── jenkins_tmp                          Jenkins temporary folder.
└── jenkins.war                          Jenkins war package. Can execute programs.
```

## Reliable Jenkins Deployment

- In `$HOME/reliable_home` directory, create jenkins_home, jenkins_tmp
- Download official [War package](http://mirrors.jenkins.io/) to $HOME/reliable_home directory
- jenkins service launches at port 9910

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

Change `$HOME/reliable_home/jenkins_home/config.xml` useSecurity to false, and restart the Jenkins.

```xml
<useSecurity>false</useSecurity>
```

0. input the `initialAdminPassword` and next.
0. select `Install suggested plugins` and wait for Jenkins plugins installation ready.

---

## Build Tasks Sample

- [jenkins-android.md](./jenkins-android.md)
- [jenkins-ios.md](./jenkins-ios.md)
- [jenkins-web.md](./jenkins-web.md)
