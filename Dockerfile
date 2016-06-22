# Dockerizing Reliable-master

FROM reliable-docker-base

MAINTAINER xdf<xudafeng@126.com>

WORKDIR /

COPY . /reliable-master

WORKDIR /reliable-master

RUN make build
