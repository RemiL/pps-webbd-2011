var nbOngletsOuverts = 0;

function addTab(title, id) {
    if (title == undefined)
        title = 'New task';

    var index = $("#action").tabs("length");

    // Enlève le bouton pour ajouter un onglet
    var ajouterOnglet = document.getElementById('ajouterOnglet');
    document.getElementById('listeOnglets').removeChild(ajouterOnglet);

    // Construit l'url avec l'id de la tache
    var url = '';
    if (id != undefined)
        url += '?id=' + id;

    // Construit le div contenant les actions possibles sur la tâche
    var divContent = document.createElement("div");
    divContent.id = "ui-tabs-action-" + (id != undefined) ? id : index;
    var ulContent = document.createElement("ul");
    ulContent.className = "menuAction";
    divContent.appendChild(ulContent);
    $("#action").append(divContent);

    // Ajoute l'onglet de la tâche
    $("#action").tabs('add', "#"+divContent.id, title);
    $("#action").tabs("select", index);

    // Remet le bouton pour ajouter un onglet
    ajouterOnglet.className = 'ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only';
    document.getElementById('listeOnglets').appendChild(ajouterOnglet);

    // Crée l'onglet Edit
    $("#" + divContent.id).tabs({ tabTemplate: '<li><a class="menuActionTab" href="#{href}">#{label}</a></li>', cache: true, idPrefix: 'ui-tabs-action-menu' });
    $("#" + divContent.id).tabs("add", "inc/taskEditor.php" + url, "Edit");
    // JQuery crée 2 div dont un inutil, il faut l'enlever
    nbOngletsOuverts++;
    $("#ui-tabs-action-menu" + Number(nbOngletsOuverts * 2 - 1)).detach();
    $("#" + divContent.id).tabs("add", "inc/mail.php" + url, "Mail");
    // JQuery crée 2 div dont un inutil, il faut l'enlever
    nbOngletsOuverts++;
    $("#ui-tabs-action-menu" + Number(nbOngletsOuverts * 2 - 1)).detach();
    $("#" + divContent.id).tabs("add", "inc/text.php" + url, "Text");
    // JQuery crée 2 div dont un inutile, il faut l'enlever
    nbOngletsOuverts++;
    $("#ui-tabs-action-menu" + Number(nbOngletsOuverts * 2 - 1)).detach();

    return index;
}

function closeTab(event, ui) {
    if (Task.tasks[ui.tab.hash.substr(1)])
        Task.tasks[ui.tab.hash.substr(1)].closeEditor();
}