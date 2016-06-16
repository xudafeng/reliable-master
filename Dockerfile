# Dockerizing Reliable-master

FROM reliable-base-docker

WORKDIR /

COPY . /reliable-master

WORKDIR /reliable-master

RUN npm install --registry=https://registry.npm.taobao.org

RUN make build
