Gaia v.1
========================
0) Οι προυπάρχουσες version βαφτίζονται 0.χ και η παρούσα ανεβαίνει στο github 

1) το πρότυπο του ipanel με τον κασαρισμένο ajax 
to pagevars στους editor αντικαθίσταται από το post_blocks
σε ξεχωριστό table

2) to taxonomy χωρίζεται σε cat και arango ή mongo tags,
postax καταργείται

3) Gaia.js καταργείται το d.db.is με το G.is

4) το maria json format μπαίνει σε πολλαπλά field όπως το post.tag 

5) post blocks to mariadb? reusability? a block can be fastcoded with different type of data. 
Post has to be cached. Paragraph is the block 
Each paragraph needs EDITOR

6) basic for cms is TEMPLATING . 
7) to ασύγχρονο loading με τα δυσκίνητα id - varpage καταργείται. 
8) Ένα στημένο template πρέπει να μπορεί να αλλάξει χωρίς να πρέπει να στηθεί απ' την αρχή. 
9) Κατεβάζοντας ένα ΑΠΛΟ html5 πρέπει να ενσωματωθεί σε 5 λεπτά ΣΑΝ GAIA TEMPLATE.
hOW TO succeed the above???
κάνω append με τα 
h1:site_title
h2:subtitle,
h3:main chapters
set banner image #banner

Faster way is javascript append 
$('h1').text('Top header!');
$('h2').text('Subtitle');
$('h3').text('All Chapters');
$('#banner').css('background-image','url(https://scontent.fath6-1.fna.fbcdn.net/v/t1.0-9/61155773_10218553843812959_7617648790408790016_n.jpg?_nc_cat=108&_nc_ohc=Z7dnoXZqtCwAQnFZJmfDmfH3BHg_R_UO-_wWxWi5WrnmHW_lfEQkcBT4A&_nc_ht=scontent.fath6-1.fna&oh=a85d082ea94892e0374e5bf4ab38dd21&oe=5E7F4334)');
$('nav').html('main_menu');

Μπορεί να δοθεί μια λίστα με appended text σε κάθε html στο varpage 
Ή ακόμα καλύτερα να γίνεται μια αυτόματη αντιστοίχηση

10) tO PAGE JSON σε mongodb (pages collection), όπου σώζεται καιτο metadata
11) TO POST BLOCK
12) TO MENU 
13) tagging system σε couchdb  https://aimd5.com:6984/_utils/#
14) install.sh, update.sh
15) κάθε template ένα setup.json Ο ΧΑΡΤΗΣ ΜΕ ΤΑ ΒΑΣΙΚΑ ΣΤΟΙΧΕΙΑ ΠΟΥ ΘΑ ΔΙΑΧΕΙΡΙΣΤΕΙ ΤΟ ΣΥΣΤΗΜΑ
16) ΚΑΘΕ μορφή σελίδα περνάει από τρία στάδια 
Α) ELES ΣΕ ΌΛΕΣ ΤΙΣ ΓΛΩΣΣΕΣ - PHP, node.js, python, java 
ELES έχουν data, ξεχωρισμένο από style 
B) json   
Γ) html + style

ΣΥΝΟΨΗ
========
- POST BLOCKS
- TEMPLATING SYSTEM with json maps 
- PAGE WITH ELES (json map from any language with html) , 
with last stage html + diff style.css
- install , update, backup, versioning system

UPDATE LOG
================
ok - css2json.js nodejs css => json, json => css, css editor is  
ok - html2json.js nodejs html =>json, json=>html

17) wizard is useless, δε θέλουμε html editor, απλά να προσαρμόζεται
το data
18) boxy and table style
19 ΤΟ ασύγχρονο appending ολου του html απ' τη javascript καταργείται παντού (και απ'το gaia.js)
χρησιμοποιείται το πρότυπο loading του ipanel.

#builder
##STEP 1
creates and edits TEMPLATE previews THE FIRST STEP OF TEMPLATE integration
Also can create static htmls 
Much better than analyzing html to json with html ELES! Saves time!!!!
##STEP 2
previews are cut to pages, and modules (css must be separate)
htmls has to be converted to php dynamic files. HOW???
##STEP 3
- 1 json file is created for every template/page with template/modules, it is the URL_PAGE MAP
- data is json buffered and appended from gaia/dsh/ajax.php
MAP jsons can be sent to MONGO or FILES

20) Gaia::start_page() just set only template/page file for each template,
mains pages are containers with json appended eles (change word modules).
DELETE PUBLIC HEADERS AND FOOTERS.
URIS        MAIN FILE       CONTENTS IN  PAGE PARAMS
page uri => page.file       page.json    $_GET['page']   
post uri => page.file
user name 
tax name
global uris (index,login,register) 

NO custom pages, I ONLY create a template/page (NO HTML IN DB)
if i want one custom page create EMPTY/SIMPLE container.
A page is a full container, while a post is just data.
Maria Page not needed, just more jsons 
Post URI describes the post content in the featured main container.

21) tags are separate from other non-parenting taxonomies.
tags are not customizable and restricted.
tags in this version is json_array in post table.
22) seokeywords are replaced with tags in SEO.

Special Thanks to 
summernote.org for the editor,
sortablejs for the drag and drop effects,
bootstrap.js for modals, buttons, icons, 
jquery for fast js usability,

BIND INSTALLED, 
NGINX OR APACHE2 INSTALLED,

do sth with d3js 
SHELL
1) INSTALL GIT
2) CHECK WEBSERVER 
1) create /var/www/setup.json with domain data 


AIMD5 CMS & PLATFORM
ARTIFICIAL 
INTELLIGENCE
MULTILANGUAGE (PHP,JAVASCRIPT,PYTHON)
MULTIDOMAIN (GAIA ONE SYSTEM FOR ALL DOMAINS)
MULTIDATABASE (1.0 MARIA+JSON FILES) faster + REDIS, MONGO , lighter SQLITE + JSON FILES

WIDGET
ok SIMPLE DRUG AND DROP RETURNS EVERYTHING TO DEFAULT VALUES!!!
ok correct ajax page buffer at methods improving My Methods
ok NEW EDIT WIDGET DEFAULTS
ok widget delete from [page].json
ok DEBUG MULTIPLE INSTANCES OF SAME WIDGET DO NOT SAVE!!!
- global (all templates & domains) & local widgets (only template)

ΠΡΩΤΑ ΟΙ widget μεταβλητές να διαβάζει τα [widget].json defaults
και με τα function tou Μy παραμετροποιημένα, μετά το drag and drop 
να βάζει παραμέτρους 
ok ΚΑΙ ΝΑ ΣΩΖΕΤΑΙ ΣΩΣΤΑ ΣΤΟ [page].json!!!!
> builder

MENU
ok- delete menu 
ok update ui
- correct sort drag and drop sortable
- connect with My+widgets
- add to menu to post

TEMPLATES
ok- api show and install template

INSTALLATION
- setup domain from scratch in the same server
-1 shell installation get global vals
-1 gaia git clone to /var/www
-2 decompress gaia
-3 create domain (install bind
-4 

UPDATE (in different folder)
-check is.current_version 
- gaia api show version

BACKUP
- 

- reset vals in modal 
- page vals in modal

PAGE (BUILDER)
- add varpages
- correct new page 
- 

V.1.0 
3 domains ready
(aimd5.com that is cms documentation site,
nikosdrosakis.gr person website
artesmundi.gr artistic story)
2 APPLICATIONS (tml & bks)
aimd5 cms version 1 

INSTALLATION
- shell update
- backup, version

CONNECT
- registration
- login 

REST API 

DATA CREATION
-post 

USERS
-user


PRODUCTION CIRCLE one minor EVERY MONTH
TODO 1.1 JAN UPDATE
- BUILDER (html wizard) customized with varpages
- POST cron activate post, load img modal SELECT FROM img folder
- NO database setup, cms light (maria2sqlite,json2mongo, mongo2json, redisORnot)
- more widgets 
- integrate templates
- SEPARATE CMS & PLATFORM (cms independent apps). CMS built on top of platform
TODO 1.2 FEB UPDATE
- LOCAL (MULTILANGUAGE)

- post comments 

menu 
========
orient
title
style (css ? 

επανέρχεται η ανάγκη custom page??
οχι φτιάχνεται template/page και πάνω της μπαίνουν τα links

POST_URI
user_uri
tax_URI

τα links είναι απλά alias


POST add to menu checkbox ME DROP DOWN

TA MENU ΠΗΓΑΊΝΟΥΝ ΣΤΙΣ ΣΕΛΙΔΕΣ 
ΣΤΙΣ ΣΕΛΙΔΕΣ ΦΑΙΝΟΝΤΑΙ 
ΤΑ POST_URI (ΠΡΩΤΗ ΚΑΙ ΠΟΣΤ ΣΕΛΙΔΕΣ), 
TAX_URI (ΓΙΑ ARCHIVES)
USER_URI (ΓΙΑ USER PAGES)
app_uri (για apps)

εισαγωγικές σελίδες με πολλά widgets χωρίς κάποιο συγκεκριμένο ποστ
αντιμετωπίζονται ως template/pages με ποιο uri????

wampserver gaia setup
1) download gaia latest, unzip to c:/wamp64/www (2.4mb in tar.gz format),
open a browser and run page localhost/gaia
2) complete forms and press button install to create virtual host.
(no need to use wampserver create host)

3) setup 
	a) creates file system
	b) modifies windows hosts file append two lines in C:\Windows\System32\drivers\etc\hosts

	127.0.0.1	drosakis.com
	::1	drosakis.com

c) 
add to 
C:\wamp64\bin\apache\[apache2.4.41]\conf\extra\httpd-vhosts

<VirtualHost *:80>ServerName drosakis.com 
		DocumentRoot "c:/wamp64/www/drosakis.com" 
		<Directory  "c:/wamp64/www/drosakis.com/">
		Options +Indexes +Includes +FollowSymLinks +MultiViews
		AllowOverride All
		Require local
	</Directory>
</VirtualHost>

d)  creates mariadb database
and redirects to site automatically


UPDATE 
use sed to license files 
sed -i '1 i\(c)Nikos Drosakis - AImd5.com' clijax.php
<!--
cliajax.php 
ajax cli 
Copyright 2019, Nikos Drosakis
Gaiacms version v.0.51 - 

GNU General Public License v3.0
-->


3-1-2020
- admin.php / template, widget repos
ok- globalize widgets
ok- pvar finish
ok- menu dnd correct
ok- menu ready
???- widget dnd mistaken sorting
- redis globals or json
- templates 

ποια η διαφορά του widget menu
me to menu

to menu είναι widget
widget/edit/menu 


%starting from LIKE %X%
~global => GS[global] 
@user
#tag

ΧΡΕΙΑΖΕΤΑΙ SHORTCODE 
{"menu.title":"input"},
{"menu.title":"list-"}

1) ένα step παραπάνω τα widgets
θα ήταν πολύ καλό σε couchdb
2) uri rules must be created (μην ψάχνει κάθε φορά στο σύνολο)
3) switch templates


class wid - class pvar
those are dynamic parameters 

class wid for widgetized areas


class pvar for global variables(pvar) appended
pvars started with init



sudo apt-get install php7.2-xml (OR CURRENT VERSION)

AT THE BEGINNING
no version control for templates and widgets 


===
url rules
==
public 1st level is page
dsh 1st level is mode
2nd level for both is sub
pagetypes (post,tax,tag,user,search,static)
if not post/uri
if not tax/name
if not tag/name
if not user/uri
if not search/q (
then static (index.php)

menu and uris
=============
menu has to set pagetype ("/post" except static)

what is static page in template pages
===================
pagetypes are default pages like 
post.php, tax.php, tag.php, user.php, search.php,
index.php is only the homepage (because no uri is there) and is widgetized as well
By default the ele1 has the widget of the page
E.g post.php in ele1 has post/uri but 
if no 2nd uri level then returns archieve of post/user/tag/etc
search & q returns all typeof data in an archieve.

So paget post.php is entered is sub exists
So paget user.php is entered is sub exists
So paget tax.php is entered is sub exists

else they return archieve.php 

pass uri rules in start_page 

Taxonomy && Postgroup id
========================


TEMPLATE INTEGRATION
=======================
After switching template to active

SCALING WIDGETS
What if we have 20 widgets in a page that 4 of them use the same queries;
a) My methods run uniquely one time each one (if query is the same).
That 's a more complex task - scaling queries for performance.
Using separate queries from html gives me the opportunity to do that. 

GLOBAL AND LOCAL WIDGETS
Widget file is one php file (at this versoin), css and js are included in the one widget file. 
Local widgets are in included at template folder. 
Create a list of widgets in template.json in template activate
A list of widgets must exist 
Widget names must me unique.
For a start, global widgets remain at gaia folder
and at the first load of page 
saves widgetized areas AND CREATES [page].json.

JSON FILES?
Widget 

GAIA_INSTALL
1	create domain folder
2	move myblog to template
3 	create domain index.php && .htaccess (if apache)
4	create virtual host
5	update hosts file if windows
6 	create newdb in maria 
7 	install maria db 
8	create/update setup.json in www folder (same level with Gaia and domain folder)


UPDATE
builder

TEMPLATES
AIMD5.COM - myblog /gaiablog
nikosdrosakis - prologue

- finish setup.sh for linux
- artesmundi.gr with blogfest
- update 
- να  ξεκινήσει το builder

backup media and create artesmundi 
create artesmundi 


install with wget from command line?
install from setup interface? Easier and better is from interface


13-1-2020 domains ready for widget work but first 
todays updates
(1)USE BOTH global and local widgets 
user,tax,tax,search,archieve,post
if not exist read /var/www/gaia/widgets
in new widget new_widgetname_exist

(2)when I make updates to template 
sync template updates with store 
sync_upload_template
1) tar current folder to new version 
2) ssh send file to repo/templates 
3) sync new version in store/templates
4) couch new version template 
5) sync old gaia local templates (if exist) (GET ALL TEMPLATES INSTALLED ON ALL LOCAL DOMAINS)


post,menu,tax,tag,user,search,archieve,contact
που σώζονται οι version των templates στο template.json και τα local widgets εκεί 

- button update template
- admin python 
- select image (in uploader)
- image viewer

- τι κάνω με τα global pages user, post κτλ;
το να έχω αυτή τη φυρά σε όλα τα templates
είναι κακό.
kalo να υπάρχουν σαν επιλογή

επίσης το page user και το widget user πάνε μαζί 
με έναν τρόπο.




active systems installed


0.71
- select-image
- view image
- seo
- d3 2 dash pink boxes
- update template box
- globals update ui 
- gaia documentation
- admin python
- media groups Not set

αλλαγή στο pval όλα τα globals μπορούν 
να παίξουν σε κάποιο id όχι μόνο τα 
tagged pvars


η εξέλιξη είναι η εξής:
flexibility προσαρμογής 
το json μπορεί να γίνει mongo
το maria μπορέι να γίνει sqlite 
επιπλέον μπορεί να προστεθεί το redis

η πιο minimal εκδοχή είναι
apache2 - sqlite - json

και η πιο high 
nginx - maria - rest mongo

για να μπει η mongo όμως αυτόνομα σε κάθε σύστημα
πρέπει 
το rest να ενσωματωθεί server-0.1 να μπει 

λάθος είναι ότι η glbos version toy nikosdrosakis
λέει 0.68 ενώ η version είναι 0.70
και έχει αλλάξει 

το update της gaia 

-archieve
- search 

widget matters
check apps 
save image


check apps 
search 

What is app in gaiacms?
1) a ready template that starts with start_page()

2) app is installed in different template
no widget

app should be installable
