// Ajoute un champ pour les activities
function addInputActivities(button)
{
    var div = button.parentNode;
    var input = document.createElement("input");
    input.name = "activities[]";
    div.removeChild(button);
    div.appendChild(input);
    div.appendChild(button);

    // Autocomplétion
    var activitiesNames = new Array();
    for (var name in listBox.list)
        activitiesNames.push(name);
    $(input).autocomplete({
        source: activitiesNames
    });
}

function addInputDependencies(button)
{
    var div = button.parentNode;
    var input = document.createElement("input");
    input.name = "dependencies[]";
    div.removeChild(button);
    div.appendChild(input);
    div.appendChild(button);
}

// Change le type de date
function changeDateType(elem, event)
{
    var code = -1;
    if (!event)
        event = window.event;
    if (event.which)
        code = event.which;
    else if (event.keyCode)
        code = event.keyCode;

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
    if (form.title.value != "" && form.beginDate.value != "" && form.beginTime.value != "" && (form.dateType.value == "d" || (form.endDate.value != "" && form.endTime.value != "")))
    {
        var taskId = form.id.split('_')[1];
        var task = taskId ? Task.tasks[taskId] : null;
    
        if (task) // Mise à jour
            task.update();
        else // Nouvelle tâche
        {
            task = new Task();
            task.create(form);
        }
        // On met à jour le titre de l'onglet.
        $('.ui-tabs-selected .titreOnglet', Task.tabs).html(task.getTitle());
    }
    else
        alert("Title and date(s) must not be empty !");
}

// Supprime une tâche
function deleteTask(button)
{
    if (confirm("Delete this task ?"))
    {
        var taskId = button.href.split('#')[1];
        Task.tasks[taskId].remove();
    }
}

// Marque une tâche comme finie
function markAsCompletedTask(button)
{
    if (confirm("Task complited ?"))
    {
        var taskId = button.href.split('#')[1];
        Task.tasks[taskId].complete();
    }
}