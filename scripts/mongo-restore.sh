#!/bin/bash
# Reference: http://dimafeng.com/2015/05/31/docker-mongo-backup/

TMP_DIR="/tmp/mongorestore/"
rm -rf $TMP_DIR && mkdir $TMP_DIR
if [[ $1 =~ \.tar$ ]];
then
  #FILENAME=$(echo $1 | sed 's/.*\///')
  FILENAME=$2"/"
  echo "Data will be extracted into :"$TMP_DIR
  tar -C $TMP_DIR -xvf $1
else
  FILENAME=$(echo $1 | sed 's/.*\///')
  cp $1 $TMP_DIR$FILENAME
fi

docker run -i --rm --link reliable_mongo_${RELIABLE_ENV_CONFIG}:mongo -v $TMP_DIR:/tmp mongo bash -c 'mongorestore --drop -v --host $MONGO_PORT_27017_TCP_ADDR:$MONGO_PORT_27017_TCP_PORT --db '$2' /tmp/'$FILENAME' && chmod 777 /tmp'
rm -rf $TMP_DIR
