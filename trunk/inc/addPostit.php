<?php
    $path = "../data/" . $_POST['id'] . "/postIts.xml";
    
    $xml = simplexml_load_file($path);

    $postit = $xml->addChild('postIt');
    $postit->addChild('content', $_POST['text']);
    $position = $postit->addChild('position');
    $position->addChild('x', $_POST['x']);
    $position->addChild('y', $_POST['y']);
    
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