<div class="contentMenuAction">
	<form  name="taskMail" class="taskEditor" onsubmit="sendMail(this, calendarService.getUserId()); return false;">
        <div class="recipient">
            <label for="recipient">Recipient</label><input name="recipient" type="text" />
        </div>
        <div class="object">
            <label for="object">Object</label><input name="object" type="text" />
        </div>
        <div>
            <label for="content"></label><div class="content"><textarea name="content"></textarea></div>
        </div>
		<div class="button">
			<input value="Send" type="submit" />
        </div>
    </form>
</div>