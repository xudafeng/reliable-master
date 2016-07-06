#!/bin/bash
# Reference: http://dimafeng.com/2015/05/31/docker-mongo-backup/

rm -rf /tmp/mongodump && mkdir /tmp/mongodump
docker run -i --rm --link reliable_mongo:mongo -v /tmp/mongodump:/tmp mongo bash -c 'mongodump -v --host reliable_mongo:27017 --db reliable --out=/tmp && chmod 777 /tmp/*'
tar -cvf $2 -C /tmp/mongodump $1
rm -rf /tmp/mongodump
