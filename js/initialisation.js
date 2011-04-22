$(function () {
    $("#action").tabs({ closable: true, tabTemplate: '<li><a class="titreOnglet" href="#{href}">#{label}</a></li>', cache: true });
    $("#afficherPostit").button({ icons: {primary:'ui-icon-circle-triangle-n'}, text: false });
    $("#ajouterOnglet").button({ icons: {primary:'ui-icon-plusthick'}, text: false });
    $("#ajouterOnglet").click(function() { addTab(); });
    $("#afficherPostit").click(function() { afficherCacherPanneauPostit(); });
    $("#panneauPostit").dblclick(function (event) { addPostit(event); });
});