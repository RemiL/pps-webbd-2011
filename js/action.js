var indexOngletsSecondairesOuverts = 0;
var indexOngletsOuverts = 0;

function addTab(title, id, idpostit, namebox)
{
    if (title == undefined)
        title = 'New task';

    // Enlève le bouton pour ajouter un onglet
    var ajouterOnglet = document.getElementById('ajouterOnglet');
    document.getElementById('listeOnglets').removeChild(ajouterOnglet);

    // Construit l'url avec l'id de la tache
    var url = '';
    if (id)
        url += '?id=' + id;
    else if (idpostit)
        url += '?idpostit=' + idpostit;
    else if (namebox)
        url += '?namebox=' + namebox;

    // Construit le div contenant les actions possibles sur la tâche
    var divContent = document.createElement("div");
    divContent.id = "ui-tabs-action-" + (id ? id : indexOngletsOuverts);
    var ulContent = document.createElement("ul");
    ulContent.className = "menuAction";
    divContent.appendChild(ulContent);
    $("#action").append(divContent);

    // Ajoute l'onglet de la tâche
    $("#action").tabs('add', "#"+divContent.id, title);
    $("#action").tabs("select", Number($("#action").tabs("length")-1));

    // Remet le bouton pour ajouter un onglet
    ajouterOnglet.className = 'ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only';
    document.getElementById('listeOnglets').appendChild(ajouterOnglet);

    // Crée l'onglet Edit
    $("#" + divContent.id).tabs({ tabTemplate: '<li><a class="menuActionTab" href="#{href}">#{label}</a></li>', cache: true, idPrefix: 'ui-tabs-action-menu' });
    $("#" + divContent.id).tabs("add", "inc/taskEditor.php" + url, "Edit");
    // JQuery crée 2 div dont un inutile, il faut l'enlever
    indexOngletsSecondairesOuverts++;
    $("#ui-tabs-action-menu" + Number(indexOngletsSecondairesOuverts * 2 - 1)).detach();

    // Si la tâche est déjà sauvegardée
    if (id)
    {
        // Crée l'onglet Mail
        $("#" + divContent.id).tabs("add", "inc/mail.php", "Mail");
        // JQuery crée 2 div dont un inutile, il faut l'enlever
        indexOngletsSecondairesOuverts++;
        $("#ui-tabs-action-menu" + Number(indexOngletsSecondairesOuverts * 2 - 1)).detach();
        // Crée l'onglet Text
        $("#" + divContent.id).tabs("add", "inc/text.php?id=" + calendarService.getUserId() + "&name=" + id, "Text");
        // JQuery crée 2 div dont un inutile, il faut l'enlever
        indexOngletsSecondairesOuverts++;
        $("#ui-tabs-action-menu" + Number(indexOngletsSecondairesOuverts * 2 - 1)).detach();

        // Création du bouton de suppression
        var buttonDeleteTaskContainer = document.createElement("li");
        buttonDeleteTaskContainer.className = "ui-state-default ui-corner-top";
        var buttonDeleteTask = document.createElement("a");
        buttonDeleteTask.className = "menuActionTab";
        buttonDeleteTask.href = "#"+id;
        buttonDeleteTask.onclick = function(event) { deleteTask(this); event.preventDefault(); event.stopPropagation(); };
        buttonDeleteTask.appendChild(document.createTextNode("Delete"));
        buttonDeleteTaskContainer.appendChild(buttonDeleteTask);
        ulContent.appendChild(buttonDeleteTaskContainer);
    }

    indexOngletsOuverts++;

    return $("#action").tabs('option', 'selected');
}

function closeTab(event, ui)
{
    if (ui.panel)
    {
        var task = Task.tasks[$('form', ui.panel).attr('id').split('_')[1]];
        if (task)
        {
            var closed = task.closeEditor();
            
            for (id in Task.tasks)
                Task.tasks[id].updateTabIndexAfterTabClosed(closed);
        }
    }
}