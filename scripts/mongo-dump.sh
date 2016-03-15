#!/bin/bash
# Reference: http://dimafeng.com/2015/05/31/docker-mongo-backup/

rm -rf /tmp/mongodump && mkdir /tmp/mongodump
docker run -i --rm --link reliable_mongo_${RELIABLE_ENV_CONFIG}:mongo -v /tmp/mongodump:/tmp mongo bash -c 'mongodump -v --host $MONGO_PORT_27017_TCP_ADDR:$MONGO_PORT_27017_TCP_PORT --db '$1' --out=/tmp && chmod 777 /tmp/*'
tar -cvf $2 -C /tmp/mongodump $1
rm -rf /tmp/mongodump
