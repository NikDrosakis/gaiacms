#!/bin/bash
> update.log

newver=$1
domain=$2
template=$3
pass="n130177!"
#if store and domain in same server (droserver)
if [ "62.38.140.132" == $(dig +short myip.opendns.com @resolver1.opendns.com) ]; then
ip="192.168.2.2"
else
ip="62.38.140.132"
fi 

#1) tar current folder to new version 
tar -czvf /var/www/gaia/uploads/$template-$newver.tar.gz /var/www/$domain/templates/$template

#2) ssh send file to repo/templates 
#cp /var/www/gaia/uploads/$template-$newver.tar.gz /var/www/api/repo/templates 
sudo sshpass -p $pass rsync -zvh /var/www/gaia/uploads/$template-$newver.tar.gz dros@$ip:/var/www/api/repo/templates --log-file=update.log

#3) replace new version in store/templates
#this is the job of the ADMIN NOT OF THE UPLOADER  to update current version with the uploaded
sudo sshpass -p $pass rsync -urvi /var/www/$domain/templates/$template dros@$ip:/var/www/api/store/templates --delete --log-file=update.log

echo "synced"