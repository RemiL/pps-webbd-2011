<?php
    // Echange l'index de deux acivities
    $path = "../data/" . $_POST['id'] . "/activities.xml";
    
    $xml = simplexml_load_file($path);

    // Parcourt les activities � la recherche des activities voulues pour �changer leur index
    foreach ($xml->activity as $activity) 
    {
        if($activity->index == $_POST['index'])
            $activity->index = $_POST['newIndex'];
        else if($activity->index == $_POST['newIndex'])
            $activity->index = $_POST['index'];
    }
    
    // Retourne 1 si l'�criture s'est bien pass�e
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