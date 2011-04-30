<?php
    $path = "../data/" . $_POST['id'] . "/postIts.xml";
    
    $xml = simplexml_load_file($path);

    $idPostit = intval($_POST['idPostit']);

    unset($xml->postIt[$idPostit]);
    
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