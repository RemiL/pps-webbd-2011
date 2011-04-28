<?php
	if (!$f = fopen("../data/".$_POST['id']."/"."docs/".$_POST['name'].".txt", "w"))
	{
		echo 0;
		exit;
	}
	else
	{
		fputs($f, $_POST['text']);
		fclose($f);
        echo 1;
	}
?>