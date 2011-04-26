<div class="contentMenuAction">
	<form name="taskEditor" class="taskEditor" <?php if (isset($_GET['id'])) echo "id=\"form_{$_GET['id']}\""; ?>>
        <div class="recipient">
            <label for="recipient">recipient</label><input name="recipient" type="text" />
        </div>
        <div class="object">
            <label for="object">object</label><input name="object" type="text" />
        </div>
        <div>
            <label for="body"></label><div class="body"><textarea name="body"></textarea></div>
        </div>
		<div class="button">
			<input value="Send" type="button" />
        </div>
  
        <?php
        if (isset($_GET['id']))
        {
	        echo "<script type=\"text/javascript\">";
	        echo "Task.tasks['{$_GET['id']}'].fillEditor();";
	        echo "</script>";
        }
        ?>
    </form>
</div>