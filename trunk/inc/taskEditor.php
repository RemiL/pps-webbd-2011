<div class="contentMenuAction">
    <form name="taskEditor" class="taskEditor" <?php if (isset($_GET['id'])) echo "id=\"form_{$_GET['id']}\""; ?>>
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
	        <label for="dependancies">Dependancies</label> !TODO!
        </div>
        <div>
	        <label for="activities">Activities</label> !TODO!
        </div>
        <div>
	        <label for="description">Description</label><div class="description"><textarea name="description"></textarea></div>
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