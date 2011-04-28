<div class="contentMenuAction">
    <form name="text" class="taskEditor" onsubmit="saveText(this, calendarService.getUserId()); return false;">
		<textarea class="champTexte" name="text"></textarea>
		<input type="Submit" name="save" value="Save" />
		<input type="button" value="Export" onClick="exportText(this.parentNode, calendarService.getUserId());" />
	</form>
</div>