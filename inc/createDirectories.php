<?php
$id = $_POST['id'];

$filename = '../data/'.$id;

// Cree le repertoire de l'utilisateur si c'est sa premiere connexion
if (!file_exists($filename)) 
{
    mkdir($filename.'/docs', 0777, true);
    
    if (!$f = fopen($filename.'/postIts.xml', 'w'))
    {
	    echo 0;
	    exit;
    }
    else
    { 
        $text = '&lt?xml version="1.0" encoding="utf-8"?&gt&ltpostIts&gt&lt/postIts&gt';
        $text = str_replace('&gt', '>', $text);
        $text = str_replace('&lt', '<', $text);
        fputs($f, $text);
	    fclose($f);
        
        if (!$f = fopen($filename.'/activities.xml', 'w'))
        {
	        echo 0;
	        exit;
        }
        else
        { 
            $text = '&lt?xml version="1.0" encoding="utf-8"?&gt&ltactivities&gt&lt/activities&gt';
            $text = str_replace('&gt', '>', $text);
            $text = str_replace('&lt', '<', $text);
            fputs($f, $text);
	        fclose($f);
            echo 1;
        }
    }
}
?>