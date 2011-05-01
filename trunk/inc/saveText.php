<?php
// Ecrit un texte dans le fichier txt correspondant à la tâche et à l'utilisateur
// Retourne 1 si tout s'est bien passé
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