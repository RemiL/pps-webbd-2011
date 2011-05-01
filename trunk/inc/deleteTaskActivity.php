<?php
    // Supprime une task d'une activité
    $path = "../data/" . $_POST['id'] . "/activities.xml";
    
    $xml = simplexml_load_file($path);

    $i = 0;
    $j = 0;

    // Recherche l'activité correspondant à l'index voulu
    foreach ($xml->activity as $activity) 
    {
        if($activity->index == $_POST['index'])
        {
            // Recherche la task à supprimer et la supprime
            foreach ($activity->tasks[0] as $task) 
            {
                if($task == $_POST['idTask'])
                {
                    unset($xml->activity[$i]->tasks[0]->task[$j]);
                    break;
                }
                $j++;
            }
        }
        $i++;
    }

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