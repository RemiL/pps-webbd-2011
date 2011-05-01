<div class="contentMenuAction">
    <form name="taskEditor" class="taskEditor" <?php if (isset($_GET['id'])) { echo 'id="formTask_'.$_GET['id'].'"'; } else if(isset($_GET['idpostit'])) { echo 'id="formPostit_'.$_GET['idpostit'].'"'; } ?> onsubmit="editTask(this); return false;">
        <div>
            <label>Title</label><input name="title" type="text" />
        </div>
        <div>
            <label>
                <select name="dateType" onchange="changeDateType(this, event)" onkeydown="changeDateType(this, event)">
                    <option value="w">When</option>
                    <option value="d">Due for</option>
                </select>
            </label>
            <input name="beginDate" type="text" />
            <input name="beginTime" type="text" />
            <span>
                to
                <input name="endDate" type="text" />
                <input name="endTime" type="text" />
            </span>
        </div>
        <div>
            <label>Location</label><input name="location" type="text" />
        </div>
        <div>
            <label>Priority</label>
            <select name="priority">
                <option value="5">very high</option>
                <option value="4">high</option>
                <option value="3" selected="selected">normal</option>
                <option value="2">low</option>
                <option value="1">very low</option>
            </select>
        </div>
        <div>
            <label>Dependencies</label>
            <input name="dependencies[]" type="text" />
            <span class="buttonAddInput buttonAddInputDependencies"></span>
        </div>
        <div>
            <label>Activities</label>
            <input name="activities[]" type="text" <?php if(isset($_GET['namebox'])) { echo 'value="'.$_GET['namebox'].'"'; } ?> />
            <span class="buttonAddInput buttonAddInputActivities"></span>
        </div>
        <div>
            <label>Description</label>
            <div class="description">
                <textarea name="description"></textarea>
            </div>
        </div>
        <div class="button">
            <input type="submit" value="Save" />
        </div>
    </form>
</div>

<script type="text/javascript">
    var activitiesNames = new Array();

    for(var name in listBox.list)
        activitiesNames.push(name);
    
    $( 'input[name="activities[]"]' ).autocomplete({
    source: activitiesNames
    });
    $( 'input[name="dependencies[]"]' ).autocomplete({
    source: activitiesNames
    });

    $( ".buttonAddInputActivities" ).unbind('click');
    $( ".buttonAddInputDependencies" ).unbind('click');
    $( ".buttonAddInput" ).button( "destroy" );
    $( ".buttonAddInput" ).button({icons: {primary: "ui-icon-circle-plus"}, text: false});
    $( ".buttonAddInputActivities" ).click(function() { addInputActivities(this); });
    $( ".buttonAddInputDependencies" ).click(function() { addInputDependencies(this); });

    $('input[name="beginDate"]').datepicker();
    $('input[name="endDate"]').datepicker();
    $('input[name="beginTime"]').timepicker({});
    $('input[name="endTime"]').timepicker({});

    <?php
        if (isset($_GET['id']))
        {
            echo "Task.tasks['{$_GET['id']}'].fillEditor();";
        }
        else if(isset($_GET['idpostit'])) 
        {
            echo "panel.list[".$_GET['idpostit']."].fillEditor();";
            echo "panel.removePostit(".$_GET['idpostit'].");";
        }
    ?>
</script>