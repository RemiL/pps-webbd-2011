function addTab(title, id) {
    if (title == undefined)
        title = 'New task';

    var index = $("#action").tabs("length");
    var ajouterOnglet = document.getElementById('ajouterOnglet');
    document.getElementById('listeOnglets').removeChild(ajouterOnglet);

    var url = 'inc/taskEditor.php';
    if (id != undefined)
        url += '?id=' + id;

    $("#action").tabs('add', url, title);
    $("#action").tabs("select", index);

    ajouterOnglet.className = 'ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only';
    document.getElementById('listeOnglets').appendChild(ajouterOnglet);

    return index;
}