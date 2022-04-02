#!/bin/bash
# this file is used only at linux /var/www setup folders, windows uses setup.php 
# update add decrypt ssl + alias gaia in vhost

#for current version read /var/www/gaia/version 
ver=$1
webserver=$2
domain=$3
dbhost=$4
dbuser=$5
dbname=$6
email=$7
domtype=$8

#version=$(head -n 1 /var/www/gaia/version)
#read -p "Welcome to GaiaCMS installation v.$version. Do you want to create a domain or a subdomain? [dom/sub] " domtype
#read -p "Please insert the domain/subdomain name (without http(s)) " domain
#read -p "Insert the domain's admin email address: " email
#read -p "Mariadb database will be installed. What the hostname? " dbhost
#read -p "Please insert database user: " dbuser
#read -p "Please insert database password: " dbpass

#get standard gaia dbname from domain 
#read -p "Insert domain: " domain
#domainchunk=$(echo $domain | tr "." "\n")
#for dom in $domainchunk
#do
    #dbn+=$dom
#done
#dbname="gs_"$dbn

extip=$(dig +short myip.opendns.com @resolver1.opendns.com)

#if [[ `ps -acx|grep nginx|wc -l` > 0 ]]; then
    #webserver="nginx"
#elif [[ `ps -acx|grep apache|wc -l` > 0 ]]; then
    #webserver="apache"
#fi

#domain=$1
#email=$2
#domtype=$3 #dom(ain) | sub(domain)

gaiafolder="/var/www/gaia"
#0 download manually and copy to /var/www/folder else
#user=$(whoami)
#1 download gaia folder to /var/www decompress tar 
#if [ ! -d "$gaiafolder" ]; then
#	wget --no-check-certificate https://api.aimd5.com/repo/gaia/gaia-$version.tar.gz -P /var/www 
	#tar xvzf /var/www/gaia-$version.tar.gz
#fi

#2 create domain folders
folders=("apps" "media"  "media/thumbs" "templates")

mkdir -m 777 /var/www/$domain
for folder in "${folders[@]}"
do
    mkdir -m 777 /var/www/$domain/$folder   
done

#3 DOMAIN ROOT FILES create index and htaccess
touch index.php
touch .htaccess
echo "<?php define('GAIAROOT',dirname(dirname(__FILE__)).'/gaia/'); include GAIAROOT.'bootstrap.php'; ?>" >> /var/www/$domain/index.php
echo -e "RewriteEngine On\nRewriteBase /\nDirectoryIndex index.php index.html\nRewriteRule ^([A-Za-z0-9_-]+)/?$ index.php?page=$1&dsh=$2 [QSA] \nRewriteRule ^([A-Za-z0-9_-]+)/([A-Za-z0-9_-]+)/?$	index.php?page=$1&mode=$2 [QSA]" >> /var/www/$domain/.htaccess

#4 TEMPLATE move myblog to template
sudo cp -R $gaiafolder/myblog /var/www/$domain/templates
	
#5 WEBSERVER set virtual host for apache2 or for nginx
if [ $webserver="apache" ]; then
sudo cat <<EOF >> /var/www/apache/$domain.conf
<VirtualHost *:443>
Protocols h2 http/1.1
ServerAdmin $email
ServerName $domain
ServerAlias $domain
DocumentRoot "/var/www/$domain"
Alias "/gaia" "/var/www/gaia"
Alias "/gitweb" "/usr/share/gitweb"
<Directory />
AllowOverride All
Require all granted
</Directory>
<Directory /var/www/$domain/>
Options Indexes FollowSymLinks
AllowOverride all
Require all granted
</Directory>
ErrorLog /var/www/logs/$domain-error.log
CustomLog /var/www/logs/$domain-access.log combined
SSLEngine on
SSLCertificateFile /etc/letsencrypt/live/$domain/fullchain.pem 
SSLCertificateKeyFile /etc/letsencrypt/live/$domain/privkey.pem
 <FilesMatch "\.(cgi|shtml|phtml|php)$">
SSLOptions +StdEnvVars
</FilesMatch>
<Directory /usr/lib/cgi-bin>
SSLOptions +StdEnvVars
</Directory>
BrowserMatch "MSIE [2-6]" \
nokeepalive ssl-unclean-shutdown \
downgrade-1.0 force-response-1.0
</VirtualHost>
EOF
sudo a2ensite $domain".conf"

elif [ $webserver="apache" ]; then
sudo cat <<EOF >> /var/www/nginx/$domain
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name $domain;
    root /var/www/$domain;
    index index.php index.html;
    ssl_certificate /etc/letsencrypt/live/$domain/fullchain.pem; 
    ssl_certificate_key /etc/letsencrypt/live/$domain/privkey.pem; 
 
   location ~* \.php$ {
   fastcgi_pass unix:/run/php/php7.2-fpm.sock;                 
   include         fastcgi_params;
	expires 30d;
	proxy_pass https://192.168.2.2:8443;
	proxy_set_header X-Real-IP  $remote_addr;
	proxy_set_header X-Forwarded-For $remote_addr;
	proxy_set_header Host $host;
	proxy_read_timeout 3600;
	proxy_http_version 1.1;
	proxy_set_header Connection "";
   }
location / {
  try_files $uri $uri/ /index.php;
  rewrite ^/([A-Za-z0-9_-]+)/?$ /index.php?page=$1&dsh=$2;
  rewrite ^/([A-Za-z0-9_-]+)/([A-Za-z0-9_-]+)/?$ /index.php?page=$1&mode=$2;
}
location /gaia {
		alias /var/www/gaia;
        }	
}
EOF
sudo ln -s /var/www/nginx/$domain /etc/nginx/sites-enabled/
fi

#6 create db && install gaia.sql
mysql -u$dbuser -p$dbpass --host=$dbhost -e "create database $dbname"; 
mysql -u$dbuser -p$dbpass --host=$dbhost $dbname < /var/www/gaia/gaia.sql
mysql -u$dbuser -p$dbpass gs_$domain -e "UPDATE globs SET en='$ver' WHERE name='system_version';"

#7 create user
mysql -u$dbuser -p$dbpass gs_$domain -e "INSERT INTO user(name,pass,mail,grp,auth) VALUES($dbuser,$dbpass,$email,7,1);"

#8 set dns server  ???find .in-addr.arpa
if [ $domtype=="parent" ] || [ $domtype == "main" ]
then
touch /etc/bind/zones/db.$domain 
#forwardns='' read -r -d '' String <<"EOF"
sudo cat <<EOF >> /etc/bind/zones/db.$domain
\$TTL	3000
$domain.	IN	SOA	ns1.$domain. admin.$domain. (
			2018112810
			1200
			3600
			1209601
			60000 )
$domain.	IN	NS	ns2.$domain.
$domain.	IN	NS	ns1.$domain.
$domain.	IN	A	$extip
ns1.$domain.	IN	A	$extip
ns2.$domain.	IN	A	$extip
mail.$domain.	10	IN	A	$extip
*	IN	CNAME	$domain.
132.140.38.62.in-addr.arpa.    IN      PTR     $domain.
$domain.	IN	MX	10	mail.$domain.
EOF
#sudo sh -c "echo -e "'"$forwardns"'" >> /etc/bind/zones/db."$domain""

#reversedns='' read -r -d '' String <<"EOF"
#update with +1 in installation number
sudo cat <<EOF >> /etc/bind/zones/132.140.38.62.in-addr.arpa
132.140.38.62.in-addr.arpa.    IN      NS      ns1.$domain.
132.140.38.62.in-addr.arpa.    IN      NS      ns2.$domain.
132.140.38.62.in-addr.arpa.    IN 	PTR	$domain.
EOF
#sudo sh -c "echo -e '$reversedns' >> /etc/bind/zones/132.140.38.62.in-addr.arpa"

#namedlocal='' read -r -d '' String <<"EOF"
sudo cat <<EOF >> /etc/bind/named.conf.local
zone "$domain" {
    type master;
    file "/etc/bind/zones/db.$domain"; # zone file path
        allow-query { any; };
        also-notify { $extip; };
};
EOF
#sudo sh -c "echo -e '$namedlocal' >> /etc/bind/named.conf.local"
sudo service bind9 restart 
fi

#install ssl with let's encrypt
sudo certbot-auto certonly --standalone -d $domain  -d www.$domain

echo "Domain $domain successfully installed"

#restart webserver
sudo service $webserver restart

echo "setup_domain_complete"