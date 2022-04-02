<?php //updated:2020-01-29 20:20:37 sidebarleft- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>
        <h3 class="text-inset"><?=$data['headline']?></h3>
        <ul id="menu-desktop" class="dropdown" style="list-style-type: none;">
            <li><a href="/" <?=$_POST['page']=='' ? 'class="selected"':''?>>Home</a></li>
            <?php for($i=0;$i<count($res);$i++){ ?>
                <li><a href="<?=$res[$i]['uri']?>" <?=$_POST['page']==$res[$i]['uri'] ? 'class="selected"':''?> title="<?=$res[$i]['title']?>"><?=$res[$i]['title']?></a>
                    <?php if($_COOKIE['GSGRP'] > 3){ ?>
                        <span class="gs-pencil" onclick="location.href='/admin/posts?id=<?=$res[$i]["id"]?>'"></span>
                    <?php } ?>
                </li>
            <?php } ?>

        </ul>