<?php
    // Ajoute une task à une  activity

    $path = "../data/" . $_POST['id'] . "/activities.xml";
    
    $xml = simplexml_load_file($path);

    // On parcourt chaque activity à la recherche du bon index
    foreach ($xml->activity as $activity) 
    {
        // On ajoute la task à l'activity
        if($activity->index == $_POST['index'])
        {
            $activity->tasks->addChild('task', $_POST['idTask']);
            break;
        }
    }
    
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