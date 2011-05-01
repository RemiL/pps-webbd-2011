<?php
    // Ajoute une activity au fichier activities.xml
    $path = "../data/" . $_POST['id'] . "/activities.xml";
    
    $xml = simplexml_load_file($path);

    $activity = $xml->addChild('activity');
    $activity->addChild('name', $_POST['name']);
    $activity->addChild('index', $_POST['index']);
    $activity->addChild('tasks');
    
    // Retourne 1 si l'écriture dans le fichier s'est bien passée
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