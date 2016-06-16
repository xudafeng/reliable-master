# Dockerizing Reliable-master

FROM node:4.2.1

ENV ZEROMQ_VERSION 4.1.4

RUN apt-get update && apt-get install -y \
	libtool \
	automake \
	autoconf \
	uuid-dev \
	python-dev \
	g++ \
	python-setuptools

RUN wget http://www.mirrorservice.org/sites/distfiles.macports.org/libsodium/1.0.3_1/libsodium-1.0.3.tar.gz -P /usr/local/ \
	&& cd /usr/local \
  && mkdir libsodium \
  && tar -zxvf libsodium-1.0.3.tar.gz --strip-components 1 -C libsodium \
	&& cd ./libsodium && ./autogen.sh && ./configure \
	&& make && make install \
	&& ldconfig

WORKDIR /usr/local

RUN wget http://pkgs.fedoraproject.org/repo/pkgs/zeromq/zeromq-$ZEROMQ_VERSION.tar.gz/a611ecc93fffeb6d058c0e6edf4ad4fb/zeromq-$ZEROMQ_VERSION.tar.gz \
	&& tar -zxvf zeromq-$ZEROMQ_VERSION.tar.gz \
	&& cd ./zeromq-$ZEROMQ_VERSION \
	&& ./configure && make && make install \
	&& ldconfig

WORKDIR /

COPY . /reliable-master

WORKDIR /reliable-master

RUN npm install --registry=https://registry.npm.taobao.org

RUN make build
