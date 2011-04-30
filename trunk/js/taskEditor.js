function addInputActivities(button) {
    var div = button.parentNode;
    var input = document.createElement("input");
    input.name = "activities[]";
    div.removeChild(button);
    div.appendChild(input);
    div.appendChild(button);

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
    $(input).autocomplete({
        source: availableTags
    });
}

function addInputDependencies(button) {
    var div = button.parentNode;
    var input = document.createElement("input");
    input.name = "dependencies[]";
    div.removeChild(button);
    div.appendChild(input);
    div.appendChild(button);

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
    $(input).autocomplete({
        source: availableTags
    });
}

// Change le type de date
function changeDateType(elem, event)
{
    var code = -1;
    if (!event)
    {
        event = window.event;
    }
    if (event.which)
    {
        code = event.which;
    } else if (event.keyCode)
    {
        code = event.keyCode;
    }

    if (code == -1 || code == 38 ||code == 40 || code == 39 || code == 37)
    {
        elem = elem.parentNode.parentNode.getElementsByTagName("span")[0];

        if (elem.style.visibility == "hidden" && (code == -1 || code == 38 || code == 37))
            elem.style.visibility = "visible";
        else if (code == -1 || code == 40 || code == 39)
            elem.style.visibility = "hidden";
    }
}

// Edite une tâche
function editTask(form)
{
    var taskId = form.id.split('_')[1];
    var task;
    
    if (taskId)
    {
        task = Task.tasks[taskId];
        task.update();
        // TBC
    }
    else // new task
    {
        task = new Task();
        task.create(form);
    }
    
    $('.ui-tabs-selected .titreOnglet', Task.tabs).html(task.getTitle());
}

// Supprime une tâche
function deleteTask(button)
{
    var taskId = button.href.split('#')[1];
    
    Task.tasks[taskId].delete();
}