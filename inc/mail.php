<div class="contentMenuAction">
    <form <?php if (isset($_GET['idTask'])) echo "id='formEmail_{$_GET['idTask']}'"; ?> name="taskMail" class="taskEditor" onsubmit="sendMail(this, calendarService.getUserId()); return false;">
        <div class="recipient">
            <label for="recipient">Recipient(s)</label><input name="recipient" type="text" />
        </div>
        <div class="object">
            <label for="object">Object</label><input name="object" type="text" />
        </div>
        <div>
            <label for="content"></label><div class="content"><textarea name="content"></textarea></div>
        </div>
        <div class="button">
            <input value="Save" type="button" onclick="<?php if (isset($_GET['idTask'])) echo "editTask(Task.tasks['{$_GET['idTask']}'].form);"; ?>" />
            <input value="Send" type="submit" />
        </div>
    </form>
</div>
<script type="text/javascript">
<?php
    if (isset($_GET['idTask']))
    {
        echo "Task.tasks['{$_GET['idTask']}'].fillEmailEditor();";
        echo "Task.tasks['{$_GET['idTask']}'].completedForm();";
    }
?>
</script>