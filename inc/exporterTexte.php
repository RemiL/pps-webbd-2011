<?php
	
	header("Content-Type: text/plain");
	header("Content-disposition: attachment; filename=truc.txt");
	echo $_GET['texte'];
?>