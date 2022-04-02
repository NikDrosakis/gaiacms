<?php //updated:2020-01-29 20:20:34 clijax- v.0.73 - Author:Nikos Drosakis - License: GPL License ?>
<?php
include_once '../bootstrap.php';
$a= $_REQUEST['a'];
$b= $_REQUEST['b'];
$c= $_REQUEST['c'];
$d= $_REQUEST['d'];

if($a=='exec'){
	
   echo exec("$b");
   
   
}elseif( $a=='server'){

echo json_encode($_SERVER);

}elseif( $a=='gaia_update'){
	$sp=new Setup;
	$fileremote=AIMD5_API."repo/gaia/$b.tar.gz";
	$filelocal=GAIABASE."$b.tar.gz";
	if($sp->copysshfile($fileremote,$filelocal)){
		$res=array();
		$res[]="copied";
		 $phar = new PharData($filelocal);
		// mkdir($cms->TEMPLATESURI.$b, 0777, true);
		
		if($phar->extractTo(GAIAROOT)){
		$res[]="extracted"; // extract all files
		chmod(GAIAROOT, 0777);
		unlink($filelocal);
		}
	}else{ $res="nossh"; }
	echo json_encode($res);
	
}