var panneauPostitOuvert = false;
var nbPostit = 0;

function confirmerPostit() {
    if (document.getElementById('nouveauTextePostit') != null) {
        var text = document.getElementById('nouveauTextePostit').value;
        if (text != "") {
            var zone = document.getElementById('nouveauTextePostit').parentNode;
            zone.removeChild(document.getElementById('nouveauTextePostit'));
            zone.removeChild(document.getElementById('collerPostit'));
            zone.appendChild(document.createTextNode(text));

            var deriver = document.createElement('span');
            deriver.className = 'ui-icon ui-icon-document';
            deriver.onclick = function () { deriverPostitTache(zone.parentNode.id); };
            zone.parentNode.firstChild.appendChild(deriver);

            var postit = document.getElementById('panneauPostit').lastChild;
            var hauteur = 750;
            var y = postit.offsetTop + postit.offsetHeight;
            if (y > hauteur) {
                postit.style.top = hauteur - postit.offsetHeight + "px";
            }
        }
        else {
            document.getElementById('panneauPostit').removeChild(document.getElementById('p' + nbPostit));
        }
    }
}

function addPostit(event) {
    confirmerPostit();
    nbPostit++;
    var y = event.pageY;
    var x = event.pageX;
    var largeur = document.body.clientWidth - 4;
    var hauteur = 748;
    var postit = document.createElement('div');
    postit.id = 'p' + nbPostit;
    postit.className = 'postit ui-corner-all';

    if (y < 150 / 2) {
        postit.style.top = 0 + "px";
    }
    else if (y > hauteur - 150 / 2) {
        postit.style.top = hauteur - 150 + "px";
    }
    else {
        postit.style.top = event.pageY - 8 - 150 / 2 + "px";
    }

    if (x < 200 / 2) {
        postit.style.left = 0 + "px";
    }
    else if (x > largeur - 200 / 2) {
        postit.style.left = largeur - 200 + "px";
    }
    else {
        postit.style.left = event.pageX - 8 - 200 / 2 + "px";
    }

    var options = document.createElement('div');
    options.className = 'optionsPostit';

    var supprimer = document.createElement('span');
    supprimer.className = 'ui-icon ui-icon-closethick';
    supprimer.onclick = function () { supprimerPostit(postit.id); };

    var zoneText = document.createElement('div');
    zoneText.className = 'textPostit';

    var textarea = document.createElement('textarea');
    textarea.id = "nouveauTextePostit";
    textarea.cols = '13';
    textarea.rows = '8';
    var input = document.createElement('input');
    input.type = 'submit';
    input.id = 'collerPostit';
    input.value = 'Coller';
    input.onclick = function () { confirmerPostit(); };

    options.appendChild(supprimer);

    zoneText.appendChild(textarea);
    zoneText.appendChild(input);

    postit.appendChild(options);
    postit.appendChild(zoneText);

    document.getElementById('panneauPostit').appendChild(postit);
    document.getElementById('nouveauTextePostit').focus();

    $("#" + postit.id).draggable({ containment: 'parent' }, { scroll: false }, { stack: ".postit" });
}

function supprimerPostit(idPostit) {
    document.getElementById("panneauPostit").removeChild(document.getElementById(idPostit));
}

function deriverPostitTache(idPostit) {
    afficherCacherPanneauPostit();
    supprimerPostit(idPostit);
    addTab();
}

function afficherCacherPanneauPostit() {
    if (!panneauPostitOuvert) {
        $("#panneauPostit").switchClass("panneauPostitFerme", "panneauPostitOuvert", 0);
        panneauPostitOuvert = true;
        $("#afficherPostit").button("option", "icons", { primary: 'ui-icon-circle-triangle-s' });
    }
    else {
        $("#panneauPostit").switchClass("panneauPostitOuvert", "panneauPostitFerme", 0);
        panneauPostitOuvert = false;
        $("#afficherPostit").button("option", "icons", { primary: 'ui-icon-circle-triangle-n' });
    }
}