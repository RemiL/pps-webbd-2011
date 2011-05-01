<?php
    $path = "../data/" . $_POST['id'] . "/activities.xml";
    
    $xml = simplexml_load_file($path);

    $i = 0;

    foreach ($xml->activity as $activity) 
    {
        if($activity->index == $_POST['index'])
        {
            unset($xml->activity[$i]);
            break;
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