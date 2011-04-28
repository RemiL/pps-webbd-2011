<?php
	if (strtoupper(substr(PHP_OS,0,3)=='WIN')) 
	{ 
		$eol="\r\n"; 
	}
	elseif (strtoupper(substr(PHP_OS,0,3)=='MAC')) 
	{ 
		$eol="\r"; 
	}
	else 
	{ 
		$eol="\n"; 
	}
        
    // L'adresse mail de l'expéditeur
    $from = $_POST["from"];
		
    //Déclaration de l'adresse de destination.
	$recipient = $_POST["recipient"]; 
	
    // Le header du message	
	$headers = "X-Mailer: PHP/".phpversion().$eol;
	
	$headers .= "MIME-Version: 1.0".$eol;
 
    $headers .= 'To: '.$recipient.$eol;
 
	$headers .= 'From: '.$from.$eol; // Mettre l'adresse absolue du serveur
    
	$headers .= 'Bcc: '.$from.$eol;
	
	$headers .= 'Reply-To: <'.$from.'>'.$eol;
        
	//Définition du sujet.
	$object = $_POST["object"];
		 
	//Déclaration des messages au format texte
    $content = $eol;
    $content .= "Content-Type: text/plain; charset=UTF-8".$eol;
    $content .= "Content-Transfer-Encoding: 8bit".$eol;
	$content .= $eol.$_POST["content"].$eol;
		 
	//Envoi de l'e-mail.
	echo mail($recipient, $object, $content, $headers);
?>
			