<?php
	
	header("Content-Type: text/plain");
	header("Content-disposition: attachment; filename=".$_GET['name'].".txt");
	echo urldecode($_GET['text']);
?>