<?php //updated:2020-01-29 20:20:37 post- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>

<h1 class="strike noline grey"><span class="edit-post-title"><?=html_entity_decode($res['title']);?></span>
<?php if($_COOKIE['GSGRP'] > 3){ ?>
 <span class="gs-pencil" onclick="location.href='/admin/posts?id=<?=$res["id"]?>'"></span>
<?php } ?>
</h1>

<?php $img=$res['img']!='' ? UPLOADS.$res['img'] :'/gaia/img/myface.jpg';?>
 <a class="viewImage" href="<?=$img?>" title="">
 <img class="right edit-post-img" style="width: 40%;float:left;margin: 15px 10px 0 0;" src="<?=$img?>" alt="<?=$img?>"/>
 </a>
 <p class="edit-post-excerpt"><?=urldecode($res['excerpt']);?></p>
 <p class="edit-post-content"><?=html_entity_decode(urldecode($res['content']));?></p>