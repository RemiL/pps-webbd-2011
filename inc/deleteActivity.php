<?php
    // Supprime une activity de la liste
    $path = "../data/" . $_POST['id'] . "/activities.xml";
    
    $xml = simplexml_load_file($path);

    $i = 0;

    // Recherche l'activity qui correspond à l'index voulu et le supprime
    foreach ($xml->activity as $activity) 
    {
        if($activity->index == $_POST['index'])
        {
            unset($xml->activity[$i]);
            break;
        }
        $i++;
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