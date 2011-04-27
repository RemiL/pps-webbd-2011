<div class="contentMenuAction">
    <form name="taskEditor" class="taskEditor" <?php if (isset($_GET['id'])) echo "id=\"form_{$_GET['id']}\""; ?> onsubmit="editTask(this); return false;">
        <div>
            <label for="title">Title</label><input name="title" type="text" />
        </div>
        <div>
            <label for="beginDate">When</label>
            <input name="beginDate" type="text" />
            <input name="beginTime" type="text" />
            to
            <input name="endDate" type="text" />
            <input name="endTime" type="text" />
        </div>
        <div>
            <label for="location">Location</label><input name="location" type="text" />
        </div>
        <div>
            <label for="priority">Priority</label>
	        <select name="priority">
		        <option value="5">very high</option>
		        <option value="4">high</option>
		        <option value="3" selected="selected">normal</option>
		        <option value="2">low</option>
		        <option value="1">very low</option>
	        </select>
        </div>
        <div>
	        <label for="dependencies">Dependencies</label>
            <input name="dependencies[]" type="text" />
            <span class="buttonAddInput buttonAddInputDependencies"></span>
        </div>
        <div>
	        <label for="activities">Activities</label>
            <input name="activities[]" type="text" />
            <span class="buttonAddInput buttonAddInputActivities"></span>
        </div>
        <div>
	        <label for="description">Description</label><div class="description"><textarea name="description"></textarea></div>
        </div>
        <div class="button">
            <input type="submit" value="Edit" />
        </div>
    </form>
</div>

<script type="text/javascript">
    var availableTags = [
    "ActionScript",
    "AppleScript",
    "Asp",
    "BASIC",
    "C",
    "C++",
    "Clojure",
    "COBOL",
    "ColdFusion",
    "Erlang",
    "Fortran",
    "Groovy",
    "Haskell",
    "Java",
    "JavaScript",
    "Lisp",
    "Perl",
    "PHP",
    "Python",
    "Ruby",
    "Scala",
    "Scheme"
    ];
    $( 'input[name*="activities[]"]' ).autocomplete({
    source: availableTags
    });
    $( 'input[name*="dependencies[]"]' ).autocomplete({
    source: availableTags
    });

    $( ".buttonAddInputActivities" ).unbind('click');
    $( ".buttonAddInputDependencies" ).unbind('click');
    $( ".buttonAddInput" ).button( "destroy" );
    $( ".buttonAddInput" ).button({icons: {primary: "ui-icon-circle-plus"}, text: false});
    $( ".buttonAddInputActivities" ).click(function() { addInputActivities(this); });
    $( ".buttonAddInputDependencies" ).click(function() { addInputDependencies(this); });
    <?php
        if (isset($_GET['id']))
        {
	        echo "Task.tasks['{$_GET['id']}'].fillEditor();";
        }
    ?>
</script>