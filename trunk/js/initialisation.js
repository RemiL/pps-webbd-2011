// Crée le panneau de postit
var panel = new Panel();

// Crée la liste des box
var listBox = new ListBox();

$(function ()
{
    $("#action").tabs({ closable: true, tabTemplate: '<li><a class="titreOnglet" href="#{href}">#{label}</a></li>', cache: true, idPrefix: 'ui-tabs-action', remove: closeTab });

    // Crée le bouton pour ajouter un onglet
    var boutonAjouterOnglet = document.createElement("li");
    boutonAjouterOnglet.id = "ajouterOnglet";
    document.getElementById("listeOnglets").appendChild(boutonAjouterOnglet);

    panel.setBody(document.getElementById("panneauPostit"));
    listBox.setBody(document.getElementById("listeBox"));

    listBox.addBox("toto");
    listBox.addBox("tota");
    listBox.addBox("tote");
    listBox.addBox("totr");
    listBox.addBox("tott");
    listBox.addBox("toty");
    listBox.addBox("totu");
    listBox.addBox("totou");
    listBox.addBox("totouuu");
    listBox.list["toto"].addTask();
    listBox.list["toto"].addTask();
    listBox.list["toto"].addTask();
    listBox.list["toto"].addTask();

    $("#box .versGaucheListeBox").click(function () { listBox.moveLeft(); });
    $("#box .versDroiteListeBox").click(function () { listBox.moveRight(); });
    $("#afficherPostit").button({ icons: { primary: 'ui-icon-circle-triangle-n' }, text: false });
    $("#ajouterOnglet").button({ icons: { primary: 'ui-icon-plusthick' }, text: false });
    $("#ajouterOnglet").click(function () { addTab(); });
    $("#afficherPostit").click(function () { panel.toggle(); });
    $("#panneauPostit").dblclick(function (event) { panel.addPostit(event); });
});