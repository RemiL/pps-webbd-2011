<?php
    $path = "../data/" . $_POST['id'] . "/activities.xml";
    
    $xml = simplexml_load_file($path);

    $i = 0;
    $j = 0;

    foreach ($xml->activity as $activity) 
    {
        if($activity->index == $_POST['index'])
        {
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