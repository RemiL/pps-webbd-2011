<?php
$id = $_POST['id'];

$filename = '../data/'.$id;

// Cree le repertoire de l'utilisateur si c'est sa premiere connexion
if (!file_exists($filename)) 
{
    mkdir($filename.'/docs', 0777, true);
}
?>