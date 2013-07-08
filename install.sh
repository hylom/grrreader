FROM=./client/
DEST=/var/grdc/
INITSCRIPT=./initscript

rsync $1 -av --exclude=.* --exclude=*~ $FROM $DEST
install -pm 755 $INITSCRIPT /etc/init.d/rrreader
