<?php //updated:2020-01-29 20:20:37 menu- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>
<style>
.topnav {
    overflow: hidden;
    background-color: #333;
}
.topnav a.active {
    background-color: #4CAF50;
    color: white;
}
.topnav a:hover {
    background-color: #ddd;
    color: black;
}
.topnav a {
    float: left;
    display: block;
    color: #f2f2f2;
    text-align: center;
    padding: 10px 16px;
    text-decoration: none;
    font-size: 17px;
}
.topnav a.active {
    background-color: #4CAF50;
    color: white;
}
@media screen and (max-width: 600px) {
    .topnav a:not(:first-child) {display: none;}
    .topnav a.icon {
        float: right;
        display: block;
    }
}

@media screen and (max-width: 600px) {
    .topnav.responsive {position: relative;}
    .topnav.responsive .icon {
        position: absolute;
        right: 0;
        top: 0;
    }
    .topnav.responsive a {
        float: none;
        display: block;
        text-align: left;
    }
}
</style>
<div class="topnav" id="myTopnav">
<?php for($i=0;$i<count($res);$i++){ ?>
<a href="<?=$res[$i]['uri']?>" style="<?=$res[$i]['uri']=='/'.$_POST['page'] ? 'background:rgba(0, 100, 0, 0.1)':''?>" title="<?=$res[$i]['title']?>"><?=$res[$i]['title']?></a>
<?php } ?>
</div>