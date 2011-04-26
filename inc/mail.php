<div class="contentMenuAction">
	<form  method="POST" action= "inc/sendmail.php" name="taskEditor" class="taskEditor">
        <div class="recipient">
            <label for="recipient">recipient</label><input name="recipient" type="text" />
        </div>
        <div class="object">
            <label for="object">object</label><input name="object" type="text" />
        </div>
        <div>
            <label for="content"></label><div class="content"><textarea name="content"></textarea></div>
        </div>
		<div class="button">
			<input value="Send" type="submit" />
        </div>		
    </form>
</div>