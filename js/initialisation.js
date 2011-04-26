$(function () {
    $("#action").tabs({ closable: true, tabTemplate: '<li><a class="titreOnglet" href="#{href}">#{label}</a></li>', cache: true, idPrefix: 'ui-tabs-action', remove: closeTab });
    
    // Crée le bouton pour ajouter un onglet
    var boutonAjouterOnglet = document.createElement("li");
    boutonAjouterOnglet.id = "ajouterOnglet";
    document.getElementById("listeOnglets").appendChild(boutonAjouterOnglet);

    $("#afficherPostit").button({ icons: { primary: 'ui-icon-circle-triangle-n' }, text: false });
    $("#ajouterOnglet").button({ icons: { primary: 'ui-icon-plusthick' }, text: false });
    $("#ajouterOnglet").click(function () { addTab(); });
    $("#afficherPostit").click(function () { afficherCacherPanneauPostit(); });
    $("#panneauPostit").dblclick(function (event) { addPostit(event); });
});