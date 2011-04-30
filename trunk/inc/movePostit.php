<?php
    $path = "../data/" . $_POST['id'] . "/postIts.xml";
    
    $xml = simplexml_load_file($path);

    $idPostit = intval($_POST['idPostit']);

    $postit = $xml->postIt[$idPostit];
    $postit->position->x = $_POST['x'];
    $postit->position->y = $_POST['y'];
    
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