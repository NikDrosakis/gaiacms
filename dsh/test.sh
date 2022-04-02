#!/bin/bash
#Read the string value
#echo "Insert domain "
#read domain
if [[ `ps -acx|grep nginx|wc -l` > 0 ]]; then
    webserver="nginx"
elif [[ `ps -acx|grep apache|wc -l` > 0 ]]; then
    webserver="apache"
fi

echo $webserver
