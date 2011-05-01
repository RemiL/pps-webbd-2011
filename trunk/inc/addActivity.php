<?php
    $path = "../data/" . $_POST['id'] . "/activities.xml";
    
    $xml = simplexml_load_file($path);

    $activity = $xml->addChild('activity');
    $activity->addChild('name', $_POST['name']);
    $activity->addChild('index', $_POST['index']);
    $activity->addChild('tasks');
    
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