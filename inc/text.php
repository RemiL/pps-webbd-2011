<div class="contentMenuAction">
    <form <?php if (isset($_GET['idTask'])) echo "id='formText_{$_GET['idTask']}'"; ?> name="text" class="taskEditor" onsubmit="saveText(this, calendarService.getUserId()); return false;">
        <textarea class="champTexte" name="text"><?php
                // Charge le texte déjà enregistré
                if (isset($_GET['id']) && isset($_GET['name']))
                {
                    if(file_exists("../data/".$_GET['id']."/"."docs/".$_GET['name'].".txt"))
                    {
                       echo file_get_contents("../data/".$_GET['id']."/"."docs/".$_GET['name'].".txt");
                    }
                }
        ?></textarea>
        <div class="button">
            <input type="Submit" name="save" value="Save" />
            <input type="button" value="Export" onClick="exportText(this.parentNode.parentNode, calendarService.getUserId());" />
        </div>
    </form>
</div>
<script type="text/javascript">
<?php
    if (isset($_GET['idTask']))
    {
        echo "Task.tasks['{$_GET['idTask']}'].completedForm();";
    }
?>
</script>