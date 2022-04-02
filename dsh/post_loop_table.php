<?php //updated:2020-02-03 06:48:40 post_loop_table- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>

<table class="TFtable"><tbody>
	<tr class="board_titles">
		<th><button onclick="g.table.orderby(this);" class="orderby" id="order_sort">sort</button></th>
		<th><button onclick="g.table.orderby(this);" class="orderby" id="order_id">id</button></th>
		<th>img</th><th><button onclick="g.table.orderby(this);" class="orderby" id="order_name">name</button></th>
		<th><button onclick="g.table.orderby(this);" class="orderby" id="order_status">status</button></th>
		<th><button onclick="g.table.orderby(this);" class="orderby" id="order_uri">uri</button></th>
		<th><button onclick="g.table.orderby(this);" class="orderby" id="order_title">title</button></th>
		<th><button onclick="g.table.orderby(this);" class="orderby" id="order_subtitle">taxonomy</button></th>
		<th><button onclick="g.table.orderby(this);" class="orderby" id="order_postgrpid">postgrpid</button></th>
		<th><button onclick="g.table.orderby(this);" class="orderby" id="order_published">published</button></th>
		<th><button onclick="g.table.orderby(this);" class="orderby" id="order_delete">delete</button></th>
	</tr></tbody>

	<tbody id="list1" class="group1">
	<?php 
	$langprefix=$cms->GS['langprefix'];
	for($i=0;$i<count($sel);$i++){
		$postid=$sel[$i]['id'];
		?>
		<tr id="nodorder1_<?=$postid?>" style="cursor:move;">
			<td><span id="menusrt<?=$postid?>"><?=$sel[$i]['sort']?></span></td>
			<td id="id<?=$postid?>"><span id="id<?=$postid?>"><?=$postid?></span></td>
			<td><img id="img<?=$postid?>" src="<?=$sel[$i]['img']=='' ? '/gaia/img/myface.jpg': UPLOADS.'thumbs/'.$sel[$i]['img']?>" width="30" height="30"></td>
			<td><a href="/dsh/user?uid=<?=$sel[$i]['uid']?>"><?=$sel[$i]['username']?></a></td>
			<td id="status<?=$postid?>"><span id="status<?=$postid?>"><?=$sel[$i]['status']?></span></td>
			<td><a href="/<?=$sel[$i]['uri']?>"><?=$sel[$i]['uri']?></a></td>
			<td><a href="/dsh/post?id=<?=$sel[$i]['id']?>"><?=$sel[$i]['title'.$langprefix]?></a></td>
			<td><?=$sel[$i]['taxname']?></td>
			<td id="postgrpid<?=$postid?>"><span id="postgrpid3"><?=$postid?></span></td>
			<td id="published<?=$postid?>"><?=date('Y-m-d H:i',$sel[$i]['published'])?></td>
			<td><button id="delete<?=$postid?>" value="<?=$postid?>" name="DELETE FROM post WHERE id=@id" title="delete" class="btn btn-default btn-xs" onclick="g.ui.table.execute(this.id,this.name,this.value,this.title,'nodorder1_')">Delete</button></td>
		</tr>
	<?php } ?>

	</tbody></table>