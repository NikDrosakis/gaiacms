<?php //updated:2020-01-29 20:20:34 seopanel- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>
<!--updated:2020-01-01 18:13:48 - v. - Author:Nikos Drosakis - License: GPL License-->
<!--updated:2020-01-01 18:12:01 - v.0.52 - Author:Nikos Drosakis - License: GPL License-->
<!--updated:2020-01-01 18:10:19
v.0.52
Author:Nikos Drosakis-->

<!--updated:2020-01-01 16:47:30
v.
Author:Nikos Drosakis-->

<!--2019-12-16 21:52:58-->

<?php
$mod= $this->GS['mode'];
$seop= $this->db->f("SELECT * FROM $mod WHERE id=?",array($this->GS['id']));
?>

<div id="box_seo">
    <div class="gs-title">SEO</div>
    <label style="color:red">seo priority</label>
    <input table="post" id="priority1" value="1.0" type="number" step="0.1" min="0.1" max="1" class="form-control input-sm" style="width: 60px;">
    <input table='post' id="priority<?=$seop['id']?>" value="<?=$seop['seo_priority']?>" type="number" step="0.1" min="0.1" max="1" class="form-control input-sm" style="width: 80px;">

    <label style="color:red">seo description</label>
    <textarea onkeyup="g.ajax(g.ajaxfile,{a:'seo_description',b:this.value,c:<?=$seop['id']?>,d:'post'})" class="form-control input-sm"><?=$seop['seo_description']?></textarea>

    <label style="color:red">seo keywords</label>
    <input onkeyup="g.ajax(g.ajaxfile,{a:'seo_keywords',b:this.value,c:<?=$seop['id']?>,d:'post'})" class="form-control input-sm" value="<?=$seop['seo_keywords']?>">
</div>
<script src="/gaia/dsh/seo.js"></script>