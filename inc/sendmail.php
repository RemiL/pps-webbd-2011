	<?php
		$recipient = $_POST["recipient"]; // D�claration de l'adresse de destination.
		if (!preg_match("#^[a-z0-9._-]+@(hotmail|live|msn).[a-z]{2,4}$#", $recipient))	// On filtre les serveurs qui rencontrent des bogues.
		{
			$passage_ligne = "\r\n";
		}
		else
		{
			$passage_ligne = "\n";
		}
		
		//=====D�finition du sujet.
		$object = $_POST["object"];
		 
		//=====D�claration des messages au format texte
		$content = $_POST["content"];
		
		//adresse source
		$from =  $_GET["from"];
		
		//=====Cr�ation du message.
		$message = $passage_ligne;
		//=====Ajout du message au format texte.
		$message.= "Content-Type: text/plain; charset=\"ISO-8859-1\"".$passage_ligne;
		$message.= "Content-Transfer-Encoding: 8bit".$passage_ligne;
		$message.= $passage_ligne.$content.$passage_ligne;
	
		//=====Cr�ation du header de l'e-mail.
		$headers = "From: ".$from.$passage_ligne;
		$headers.= "Reply-to: ".$from.$passage_ligne;
		$headers.= "Cc: ".$from.$passage_ligne;
		$headers.= "MIME-Version: 1.0".$passage_ligne;
		$headers.= "Content-Type: multipart/plain;".$passage_ligne;
		 
		//=====Envoi de l'e-mail.
		mail($recipient,$object,$message,$headers);
	?>
			