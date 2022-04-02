<?php //updated:2020-01-29 20:20:37 user- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>
<h3 class="text-inset"><?=$data['headline']?></h3>
<h1 class="strike noline grey"><span class="edit-post-title"><?=$res['name'].' - '.$res['firstname'].' '.$res['lastname'];?></span>
<?php if($_COOKIE['GSGRP'] > 3){ ?>
 <span class="gs-pencil" onclick="location.href='/admin/posts?id=<?=$res["id"]?>'"></span>
<?php } ?>
</h1>

<?php $img=!$res['img'] ? '/gaia/img/user.png': GS.UPLOADS.$res['img'];?>
 <img class="right edit-post-img" style="width: 100%;height: 130px;margin: 15px 0px 0 0;" src="<?=$img?>" alt="<?=$res['name']?>"/>
 <p class="edit-post-excerpt"><?=urldecode($res['mail']);?></p>
 <p class="edit-post-content"><?=html_entity_decode(urldecode($res['content']));?></p>