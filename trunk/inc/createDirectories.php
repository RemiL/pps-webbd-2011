<?php
$id = $_POST['id'];

$filename = '../data/'.$id;

// Crée le repertoire de l'utilisateur si c'est sa premiere connexion
if (!file_exists($filename)) 
{
    // Crée le répertoire de l'utilisateur et le répertoire docs
    mkdir($filename.'/docs', 0777, true);
    
    // Crée le fichier postIts.xml et activities.xml
    if (!$f = fopen($filename.'/postIts.xml', 'w'))
    {
	    echo 0;
	    exit;
    }
    else
    { 
        // Initialise le fichier postIts.xml
        $text = '&lt?xml version="1.0" encoding="utf-8"?&gt&ltpostIts&gt&lt/postIts&gt';
        $text = str_replace('&gt', '>', $text);
        $text = str_replace('&lt', '<', $text);
        fputs($f, $text);
	    fclose($f);
        
        // Initialise le fichier activities.xml
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
        
        // retourne 1 si tout s'est bien passé
    }
}
?>