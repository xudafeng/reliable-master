# Local config
# User home path
home=/home/admin
# Path of repo to find Makefile
repo=reliable-master-prod

# Slave config, get from http://example.com/slaves
url=http://example.com/slaves
slaves=`curl -s ${url}`
# User name
user=`echo ${slaves} | grep -m1 -oE '"hostname":"[^"]*"' | head -1 | grep -oE '[0-9a-zA-Z]*\.' | grep -oE '[^.]*'`
# Slave IP
ip=`echo ${slaves} | grep -oE -m1 '"ip":"[^"]*"' | head -1 | grep -oE '[0-9.]+'`
# Slave path to backup
slave_path="~/data_backup"

cd ${home}/${repo}
make dump
scp ${home}/reliable.tar ${user}@${ip}:${slave_path}/reliable-`date +"%F-%H-%M-%S"`.tar
rm -f ${home}/reliable.tar

# 0 0,3,6,9,12,15,18,21 * * * /home/admin/reliable-master-prod/scripts/cron.sh >> /home/admin/log/reliable_master_cron.log 2>&1
