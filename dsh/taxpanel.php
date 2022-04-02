<?php //updated:2020-01-29 20:20:34 taxpanel- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>

<?php
/*
 *
 * TAXONOMY PANEL
 * included to provide taxonomy to users, pages
 *
 * */
//tax groups
$grps= $this->db->fa("SELECT * FROM taxgrp WHERE status=1");
$postid=$this->GS['id'];
//selected or parent
$selected= $this->db->fetchList("taxid","post","WHERE id=$postid");
//xecho($grps);
//tags
$tags=$this->db->fjsonlist("SELECT json_extract(tags,'$') as json FROM post");
$tags=!empty($tags) ? array_unique($tags): array();
$postags=$this->db->fjsonlist("SELECT json_extract(tags,'$[*]') as json FROM post WHERE id=$postid");
//$tags=$this->fjsonlist("SELECT json_extract(tags,'$[*]') as json FROM post");

//xecho($this->tax()->parent_from_selectedchild($taxid)['id']);
//xecho($selected);
?>

<div id="box_taxonomy">
    <a href="/dsh/taxonomy" class="gs-title">Taxonomy</a>
	
	
    <?php if(!empty($grps)){for($j=0;$j<count($grps);$j++){
        $grpid=$grps[$j]['id'];
        //select parent tax
        $stax=$this->db->fa("SELECT * FROM tax WHERE taxgrpid=? AND parent=0",array($grpid));
        $staxChildren=$this->db->fa("SELECT * FROM tax WHERE taxgrpid=? AND parent!=0",array($grps[$j]['id']));
		//xecho($staxChildren);
        ?>
        <br/>

        <label style="color:red"><a href="/dsh/taxonomy?id=<?=$grpid?>"><?=$grps[$j]['name']?></a></label>
<!-----------TAX PARENTS DROPDOWNS----------->

        <input type="hidden" id="multiple<?=$grpid?>" value="<?=$grps[$j]['multiple']?>">

        <?php if($grps[$j]['parenting']==1){ ?>

            <select class="form-control" id="tax<?=$grpid?>">
                <option value="0">Select <?=$grps[$j]['name']?></option>
                <?php for($i=0; $i<count($stax);$i++){   ?>
<!--                    <option value="--><?//=$stax[$i]['id']?><!--" --><?//=(!empty($selected) && in_array($stax[$i]['id'],$selected)) || in_array($stax[$i]['id'],$this->tax()->parents_ofselected_children($this->GS['id'])) ? "selected=selected":""?><!-->--><?//=$stax[$i]['name']?><!--</option>-->
                    <option value="<?=$stax[$i]['id']?>" <?=(!empty($selected) && in_array($stax[$i]['id'],$selected))  ? "selected=selected":""?>><?=$stax[$i]['name']?></option>
                <?php } ?>
            </select>

<!-----------TAX CHILDREN CHAIN DROPDOWNS move to js----------->
            <div id="chain<?=$grpid?>">
<?php if (!empty($staxChildren)){ ?>
                <select id="tax<?=$grpid?>"><option value=0>Select</option>
                <?php
                for($k=0; $k<count($staxChildren);$k++){ ?>
                <option value="<?=$staxChildren[$k]['id']?>" <?=in_array($staxChildren[$k]['id'],$selected) ?'selected=selected':''?>><?=$staxChildren[$k]['name']?></option>
                <?php } ?>
                </select>
<?php } ?>
                <!--append chain-->
                </div>

        <?php }else{ ?>

            <div id="box<?=$grpid?>">
                <?php for($i=0; $i<count($stax);$i++){ ?>
                    <input class="gs-input" id="tax<?=$grpid?>" <?=in_array($stax[$i]['id'],$selected) ? "checked":""?> name="tax<?=$grpid?>" type="checkbox" value="<?=$stax[$i]['id']?>"><?=$stax[$i]['name']?>
                <?php  } ?>
            </div>
            <label>Add new</label>
            <input class="gs-input" id="newtax<?=$grpid?>" style="width: 158px;">
            <button class="btn btn-default" id="newtaxsave<?=$grpid?>">Save</button>
        <?php } ?>

    <?php }} ?>
    <br/>
	    <div class="gs-title">Tags</div>
	            <div id="box<?=$grpid?>">
                <?php if(!empty($tags)){foreach($tags as $tag){ ?>
                    <input class="gs-input" id="addtag_<?=$tag?>" <?=!empty($postags) && in_array($tag,$postags) ? "checked":""?> type="checkbox" value="<?=$tag?>"><?=$tag?>
					<?php  }} ?>
				</div>
            <label>Add new (divide with comma)</label>
            <input class="gs-input" id="newtag" style="width: 158px;">
            <button class="btn btn-default" id="newtagsave">Save</button>
</div>
<script src="/gaia/dsh/taxonomy.js"></script>