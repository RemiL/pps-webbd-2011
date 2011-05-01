<?php
    // Change la position d'un postit
    $path = "../data/" . $_POST['id'] . "/postIts.xml";
    
    $xml = simplexml_load_file($path);

    $idPostit = intval($_POST['idPostit']);

    // Cherche le postit à modifier
    $postit = $xml->postIt[$idPostit];
    
    // Modifie la position
    $postit->position->x = $_POST['x'];
    $postit->position->y = $_POST['y'];
    
    // Retourne 1 si l'écriture s'est bien passée
    if (!$f = fopen($path, 'w'))
    {
	    echo 0;
	    exit;
    }
    else
    { 
        fputs($f, $xml->asXML());
	    fclose($f);
        echo 1;
    }
?>