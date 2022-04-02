<?php //updated:2020-01-29 20:20:34 taxonomy- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>
<!--updated:2020-01-01 18:13:48 - v. - Author:Nikos Drosakis - License: GPL License-->
<!--updated:2020-01-01 18:12:01 - v.0.52 - Author:Nikos Drosakis - License: GPL License-->
<!--updated:2020-01-01 18:10:19
v.0.52
Author:Nikos Drosakis-->

<!--updated:2020-01-01 16:47:30
v.
Author:Nikos Drosakis-->

<!--2019-12-20 06:38:22-->
<!-------NEW GROUP--------->
<?php if($this->GS['id']==""){ ?>
<button class="btn btn-success" id="newgroupsbtn">New taxοnomy group</button>
<?php } ?>

<!-------ALL TAXONOMIES--------->
<?php
$sel=$this->db->fa("SELECT * FROM taxgrp");
//foreach($this->GS['taxgrps'] as $grp=> $grparent){
for($i=0;$i<count($sel);$i++){
    $grp=$sel[$i]['id'];
    $grpname=$sel[$i]['name'];
    ?>
    <a class="btn btn-default" href="/dsh/taxonomy?id=<?=$grp?>"><?=$grpname?></a>
<?php } ?>

<?php if($this->GS['id']==""){ ?>

    <h3 style="margin-top:20px;">Taxonomy Groups</h3>
    <table class="table">
        <tr>
            <th>id</th>
            <th></th>
            <th>name</th>
            <th>parenting</th>
            <th>multiple</th>
            <th>status</th>
        </tr>

        <?php for($i=0;$i<count($sel);$i++){ ?>
        <tr id="line<?=$sel[$i]['id']?>">
            <td><?=$sel[$i]['id']?></td>
            <td><button class="btn btn-danger" id="deletegrp_<?=$sel[$i]['id']?>">Delete</button></td>
            <td><input class="form-control" id="name_<?=$sel[$i]['id']?>" type="text" value="<?=$sel[$i]['name']?>"></td>
            <td><?=$sel[$i]['parenting']==1?'Yes':'No'?></td>
            <td><?=$sel[$i]['multiple']==1?'Yes':'No'?></td>
            <td><select class="form-control" id="status_<?=$sel[$i]['id']?>">
                    <option <?=$sel[$i]['status']==1?'selected="selected"':''?> value="1">Active</option>
                    <option <?=$sel[$i]['status']==0?'selected="selected"':''?> value="0">Inactive</option>
            </td>
            </tr>
            <?php } ?>
    </table>


<?php }else{
    $tax=$this->db->fa("SELECT * FROM tax WHERE taxgrpid=?",array($this->id));
    /*
     * WITH OR WITHOUT PARENT
     * */
        $parents=$this->db->fetchList(array("name","id"), "tax","WHERE taxgrpid={$this->GS['id']}");
        ?>
        <script>
            var parents= <?=json_encode(array_flip($parents))?>;
            var typeid= <?=$this->GS['id']?>;
        </script>
<?php $taxname= $this->GS['taxgrp'][$this->GS['id']];?>
        <button id="newtax_<?=$this->GS['taxgrps'][$taxname]?>_<?=$taxname?>" class="btn btn-warning" style="margin:20px">New <?=$taxname?></button>

        <table class="table">
            <tr>
                <th class="id">id</th>
                <th class="id">img</th>
                <th class="id">Name</th>
                <?php if($this->GS['taxgrps'][$taxname]==1){ ?> <th class="id">Parent</th><?php } ?>
            </tr>

            <?php	if(!empty($tax)){
                for ($i=0; $i<count($tax);$i++){	?>

            <tr id="line<?=$tax[$i]['id']?>">
                        <td><?=$tax[$i]['id']?>
                            <button class="btn btn-danger" id="deletetax_<?=$tax[$i]['id']?>">Delete</button>
                        </td>
						<td>
					<?php
					//create edit post form
					echo $this->form("tax",array('img'),false,$tax[$i]);
					?>
						</td>
                        <td><input class="form-control" title="Choose a name" type="text" id="name_<?=$tax[$i]['id']?>" value="<?=$tax[$i]['name']?>"></td>

                        <td>
                            <?php if($this->GS['taxgrps'][$taxname]==1){ ?>
                            <select class="form-control"  id="parent_<?=$tax[$i]['id']?>">
                                <option value="0">No Parent</option>
                                <?php foreach($parents as $pname =>$pid){
                                    if ($pid!=$tax[$i]['id']){
                                        ?>
                                        <option <?php if($tax[$i]['parent']==$pid){echo 'selected="selected"';} ?> value="<?=$pid?>"><?=$pname?></option>
                                    <?php }} ?>
                            </select>
                                <?php } ?>
                        </td>

            </tr>
                <?php }}	?>
        </table>
<?php } ?>