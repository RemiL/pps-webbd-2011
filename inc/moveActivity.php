<?php
    $path = "../data/" . $_POST['id'] . "/activities.xml";
    
    $xml = simplexml_load_file($path);

    foreach ($xml->activity as $activity) 
    {
        if($activity->index == $_POST['index'])
            $activity->index = $_POST['newIndex'];
        else if($activity->index == $_POST['newIndex'])
            $activity->index = $_POST['index'];
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