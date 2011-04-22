function ajouterTacheBox(box) {
    if (box.offsetLeft % 207 == 0) {
        addTab();
    }
}

function supprimerBox(box) {
    if (box.offsetLeft % 207 == 0) {
        var index = Number(box.id.substring(1, box.id.length));

        if (document.getElementById('b1').offsetLeft < 0) {
            index--;
        }
        else {
            index++;
        }

        if (document.getElementById('b' + index) != null) {
            if (index < Number(box.id.substring(1, box.id.length))) {
                while (index > 0) {
                    $("#b" + index).animate({ marginLeft: '+=207px' }, 'slow');
                    index--;
                }
            }
            else {
                while (document.getElementById('b' + index) != null) {
                    $("#b" + index).animate({ marginLeft: '-=207px' }, 'slow');
                    index++;
                }
            }
        }

        index = Number(box.id.substring(1, box.id.length)) + 1;
        while (document.getElementById('b' + index) != null) {
            document.getElementById('b' + index).id = 'b' + (index - 1);
            index++;
        }

        document.getElementById("listeBox").removeChild(box);
    }
}

function boxVersHaut(box) {
    if (box.offsetLeft % 207 == 0 && Number($("#" + box.id + " .listeTaches").css("marginTop").replace(/px/, '')) % 44 == 0 && Number($("#" + box.id + " .listeTaches").css("marginTop").replace(/px/, '')) < 0) {
        $("#" + box.id + " .listeTaches").animate({ marginTop: '+=44px' }, 'slow');
    }
}

function boxVersBas(box) {
    if (box.offsetLeft % 207 == 0 && Number($("#" + box.id + " .listeTaches").css("marginTop").replace(/px/, '')) % 44 == 0 && ($("#" + box.id + " .listeTaches").height() + Number($("#" + box.id + " .listeTaches").css("marginTop").replace(/px/, ''))) > $("#" + box.id + " .corpsBox").height()) {
        $("#" + box.id + " .listeTaches").animate({ marginTop: '-=44px' }, 'slow');
    }
}

function boxVersGauche(box) {
    if (box.offsetLeft % 207 == 0) {
        var index = Number(box.id.substring(1, box.id.length)) - 1;
        if (document.getElementById('b' + index) != null) {
            box.style.zIndex = 2;
            $("#" + box.id).animate({ marginLeft: '-=207px' }, 'slow');
            document.getElementById('b' + index).style.zIndex = 1;
            $("#b" + index).animate({ marginLeft: '+=207px' }, 'slow');
            document.getElementById('b' + index).id = box.id;
            box.id = 'b' + index;
        }
    }
}

function boxVersDroite(box) {
    if (box.offsetLeft % 207 == 0) {
        var index = Number(box.id.substring(1, box.id.length)) + 1;
        if (document.getElementById('b' + index) != null) {
            box.style.zIndex = 2;
            $("#" + box.id).animate({ marginLeft: '+=207px' }, 'slow');
            document.getElementById('b' + index).style.zIndex = 1;
            $("#b" + index).animate({ marginLeft: '-=207px' }, 'slow');
            document.getElementById('b' + index).id = box.id;
            box.id = 'b' + index;
        }
    }
}

function versGaucheListeBox() {
    if (document.getElementById('b1') != undefined && document.getElementById('b1').offsetLeft % 207 == 0) {
        if (document.getElementById('b1').offsetLeft < 0) {
            var index = 1;

            while (document.getElementById('b' + index) != null) {
                $("#b" + index).animate({ marginLeft: '+=207px' }, 'slow');
                index++;
            }
        }
    }
}

function versDroiteListeBox() {
    if (document.getElementById('b1') != undefined && document.getElementById('b1').offsetLeft % 207 == 0) {
        var index = 1;

        while (document.getElementById('b' + index) != null) {
            index++;
        }

        if (document.getElementById('b' + (index - 1)).offsetLeft + 200 > document.getElementById('listeBox').offsetWidth) {
            index = 1;

            while (document.getElementById('b' + index) != null) {
                $("#b" + index).animate({ marginLeft: '-=207px' }, 'slow');
                index++;
            }
        }
    }
}