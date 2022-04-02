<?php //updated:2020-02-11 12:36:34 search- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>

<style>
#searchbox
{
	color: black;
    display: block;
    float: right;
    background: #fafad24a;
    padding: 7px;
    margin: 7px; 
    top: 10%;
    right: 0;
}
</style>
<div id="searchbox">
        <input id="search" placeholder="<?=$data['headline']?>">
        <button class="btn btn-primary" id="searchbut">Search </button>
</div>
<script>
	$(document).on("click","#searchbut",function(){
		var val=$('#search').val().trim();
		location.href='/search?mode='+val;		
	})
</script>