function addTab(title, id) {
    if (title == undefined)
        title = 'New task';

    var index = $("#action").tabs("length");

    // Enl�ve le bouton pour ajouter un onglet
    var ajouterOnglet = document.getElementById('ajouterOnglet');
    document.getElementById('listeOnglets').removeChild(ajouterOnglet);

    // Construit l'url de l'�diteur
    var url = 'inc/taskEditor.php';
    if (id != undefined)
        url += '?id=' + id;

    // Construit le div contenant les actions possibles sur la t�che
    var divContent = document.createElement("div");
    divContent.id = "ui-tabs-action" + $("#action").tabs("length");
    var ulContent = document.createElement("ul");
    ulContent.className = "menuAction";
    divContent.appendChild(ulContent);
    $("#action").append(divContent);

    // Ajoute l'onglet de la t�che
    $("#action").tabs('add', "#"+divContent.id, title);
    $("#action").tabs("select", index);

    // Remet le bouton pour ajouter un onglet
    ajouterOnglet.className = 'ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only';
    document.getElementById('listeOnglets').appendChild(ajouterOnglet);

    // Cr�e l'onglet Edit
    $("#" + divContent.id).tabs({ tabTemplate: '<li><a class="menuActionTab" href="#{href}">#{label}</a></li>', cache: true, idPrefix: 'ui-tabs-action-menu' });
    $("#" + divContent.id).tabs("add", url, "Edit");
    // JQuery cr�e 2 div dont un inutil, il faut l'enlever
    $("#ui-tabs-action-menu" + $("#" + divContent.id).tabs("length")).detach();

    return index;
}