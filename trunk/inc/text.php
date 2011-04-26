<div class="contentMenuAction">
    <form name="text" class="text" action="inc/enregistrerTexte.php?id=toto" method="POST">
		<textarea class="champTexte" name="texte"></textarea>
		<input type = "Submit" name = "save" value = "Save">
		<input type="button" value="Export" onClick="window.open('inc/exporterTexte.php?texte=toto','pop_up','width=300, height=200, toolbar=no status=no' )">
	</form>
</div>