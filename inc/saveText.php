<?php
	if (!$f = fopen($_POST['name'].".txt", "w"))
	{
		echo "Echec de l'ouverture du fichier";
		exit;
	}
	else
	{
		fputs($f, $_POST['text']);
		fclose($f);
	}
?>