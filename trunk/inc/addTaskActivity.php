<?php
    // Ajoute une task � une  activity

    $path = "../data/" . $_POST['id'] . "/activities.xml";
    
    $xml = simplexml_load_file($path);

    // On parcourt chaque activity � la recherche du bon index
    foreach ($xml->activity as $activity) 
    {
        // On ajoute la task � l'activity
        if($activity->index == $_POST['index'])
        {
            $activity->tasks->addChild('task', $_POST['idTask']);
            break;
        }
    }
    
    // Retourne 1 si l'�criture dans le fichier s'est bien pass�e
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