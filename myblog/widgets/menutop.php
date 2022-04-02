<?php //updated:2020-01-29 20:20:37 menutop- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>
<div id="dd" class="menu wrapper-dropdown">
<span class="responsive_label">Select a page</span>

                <ul id="menu-mobile" class="dropdown">
                    <?php for($i=0;$i<count($res);$i++){ ?>
                    <li>
					<a href="<?=$res[$i]['uri']?>" style="<?=$res[$i]['uri']=='/'.$_POST['page'] ? 'background:rgba(0, 100, 0, 0.1)':''?>" title="<?=$res[$i]['title']?>"><?=$res[$i]['title']?></a>
                    </li>
                    <?php } ?>

                </ul>

            </div>
