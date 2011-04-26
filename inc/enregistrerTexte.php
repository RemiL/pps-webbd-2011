<?php
	if (!$f = fopen($_GET['id'].".txt", "w"))
	{
		echo "Echec de l'ouverture du fichier";
		exit;
	}
	else
	{
		fputs($f, $_POST['texte']);
		fclose($f);
	}
?>