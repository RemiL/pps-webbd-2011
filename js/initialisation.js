﻿$(function() { 
            $("#action").tabs({ tabTemplate: '<li>#{label}</li>' });
            $("#afficherPostit").button({ icons: {primary:'ui-icon-circle-triangle-n'}, text: false });
            $("#ajouterOnglet").button({ icons: {primary:'ui-icon-plusthick'}, text: false });
            $("#ajouterOnglet").click(function() { addTab(); });
            $("#afficherPostit").click(function() { afficherCacherPanneauPostit(); });
            $( "#p1" ).draggable({ containment: 'parent' }, { scroll: false }, { stack: ".postit" });
            $( "#panneauPostit" ).dblclick(function(event) { addPostit(event); });
        });

var panneauPostitOuvert = false;
var nbPostit = 1;
    
function confirmerPostit()
{
    if(document.getElementById('nouveauTextePostit') != null)
    {
        var text = document.getElementById('nouveauTextePostit').value;
        if(text != "")
        {
            var zone = document.getElementById('nouveauTextePostit').parentNode;
            zone.removeChild(document.getElementById('nouveauTextePostit'));
            zone.removeChild(document.getElementById('collerPostit'));
            zone.appendChild(document.createTextNode(text));
            
            var deriver = document.createElement('span');
            deriver.className = 'ui-icon ui-icon-document';
            deriver.onclick = function() { deriverPostitTache(zone.parentNode.id); };
            zone.parentNode.firstChild.appendChild(deriver);
        }
        else
        {
            document.getElementById('panneauPostit').removeChild(document.getElementById('p'+nbPostit));
        }
    }
}

function addPostit(event)
{
    confirmerPostit();
    nbPostit++;
    var y = event.pageY;
    var x = event.pageX;
    var largeur = document.body.clientWidth - 4;
    var postit = document.createElement('div');
    postit.id = 'p' + nbPostit;
    postit.className = 'postit ui-corner-all';    
    
    if(y < 150/2)
    {
        postit.style.top = 0 + "px";
    }
    else if(y > 724 - 150 /2)
    {
        postit.style.top = 724 - 150 + "px";
    }
    else
    {
        postit.style.top = event.pageY - 8 - 150/2 + "px";
    }
    
    if(x < 150/2)
    {
        postit.style.left = 0 + "px";
    }
    else if(x > largeur - 150/2)
    {
        postit.style.left = largeur - 150 + "px";
    }
    else
    {
        postit.style.left = event.pageX - 8 - 150/2 + "px";
    }
    
    var options = document.createElement('div');
    options.className = 'optionsPostit';
    
    var supprimer = document.createElement('span');
    supprimer.className = 'ui-icon ui-icon-closethick';
    supprimer.onclick = function() { supprimerPostit(postit.id); };
    
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
    input.onclick = function() { confirmerPostit(); };
    
    options.appendChild(supprimer);
    
    zoneText.appendChild(textarea);
    zoneText.appendChild(input);
    
    postit.appendChild(options);
    postit.appendChild(zoneText);
    
    document.getElementById('panneauPostit').appendChild(postit);
    document.getElementById('nouveauTextePostit').focus();
    
    $( "#"+postit.id ).draggable({ containment: 'parent' }, { scroll: false }, { stack: ".postit" });
}
        
function supprimerPostit(idPostit)
{
    document.getElementById("panneauPostit").removeChild(document.getElementById(idPostit));
}

function deriverPostitTache(idPostit)
{
    afficherCacherPanneauPostit();
    supprimerPostit(idPostit);
    addTab();
}

function afficherCacherPanneauPostit()
{
    if(!panneauPostitOuvert)
    {
        $("#panneauPostit").switchClass( "panneauPostitFerme", "panneauPostitOuvert", 0 );
        panneauPostitOuvert = true;
        $("#afficherPostit").button( "option", "icons", {primary:'ui-icon-circle-triangle-s'} );
    }
    else
    {
        $("#panneauPostit").switchClass( "panneauPostitOuvert", "panneauPostitFerme", 0 );
        panneauPostitOuvert = false;
        $("#afficherPostit").button( "option", "icons", {primary:'ui-icon-circle-triangle-n'} );
    }
}    

function addTab()
{
    var index = $("#action").tabs( "length" );
    var ajouterOnglet = document.getElementById('ajouterOnglet');
    document.getElementById('listeOnglets').removeChild(ajouterOnglet);
    
    $("#action").tabs( "add" , "#newTask"+index, '<div id="i' + index + '" class="fermerOnglet" onclick="fermerOnglet(this);"><span class="ui-icon ui-icon-closethick"></span></div><a href="#newTask' + index + '" class="titreOnglet" title="New task">New task</a>', index );
    $("#action").tabs( "select" ,  index );
    
    document.getElementById('newTask'+index).appendChild(document.createTextNode('New task'+index))
    
    ajouterOnglet.className = 'ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only';
    document.getElementById('listeOnglets').appendChild(ajouterOnglet);
}

function fermerOnglet(onglet)
{
    var index = Number(onglet.id.substring(1, onglet.id.length));
    for(var i=index+1; i<$( "#action" ).tabs( "length" ); i++)
    {
        document.getElementById('i'+i).id = 'i' + (i - 1);
    }

    $( "#action" ).tabs( "remove" , index );
}

function ajouterTacheBox(box)
{
    alert("ajouter tache box " + box.id);
}

function supprimerBox(box) 
{
    var index = Number(box.id.substring(1, box.id.length));

    if (document.getElementById('b1').offsetLeft < 0) 
    {
        index--;
    }
    else
    {
        index++;
    }

    if (document.getElementById('b' + index) != null)
    {
        if (index < Number(box.id.substring(1, box.id.length)))
        {
            while (index > 0)
            {
                $("#b" + index).animate({ marginLeft: '+=207px' }, 'slow');
                index--;
            }
        }
        else 
        {
            while (document.getElementById('b' + index) != null) 
            {
                $("#b" + index).animate({ marginLeft: '-=207px' }, 'slow');
                index++;
            }
        }
    }

    index = Number(box.id.substring(1, box.id.length)) + 1;
    while (document.getElementById('b' + index) != null) 
    {
        document.getElementById('b' + index).id = 'b' + (index - 1);
        index++;
    }

    document.getElementById("listeBox").removeChild(box);
}

function boxVersHaut(box)
{
    alert("tache box vers haut " + box.id);
}

function boxVersBas(box)
{
    alert("tache box vers bas " + box.id);
}

function boxVersGauche(box)
{
    var index = Number(box.id.substring(1, box.id.length)) - 1;
    if(document.getElementById('b'+index) != null)
    {
        box.style.zIndex = 2;
        $( "#"+box.id ).animate({marginLeft: '-=207px'}, 'slow');
        document.getElementById('b'+index).style.zIndex = 1;
        $( "#b" + index ).animate({marginLeft: '+=207px'}, 'slow');
        document.getElementById('b'+index).id = box.id;
        box.id = 'b' + index;
    }
}

function boxVersDroite(box)
{    
    var index = Number(box.id.substring(1, box.id.length)) + 1;
    if(document.getElementById('b'+index) != null)
    {
        box.style.zIndex = 2;
        $( "#"+box.id ).animate({marginLeft: '+=207px'}, 'slow');
        document.getElementById('b'+index).style.zIndex = 1;
        $( "#b" + index ).animate({marginLeft: '-=207px'}, 'slow');
        document.getElementById('b'+index).id = box.id;
        box.id = 'b' + index;
    }
}

function versGaucheListeBox() 
{
    if (document.getElementById('b1') != undefined && document.getElementById('b1').offsetLeft % 207 == 0)
    {
        var index = 1;

        while(document.getElementById('b' + index) != null) 
        {
            index++;
        }

        if (document.getElementById('b' + (index - 1)).offsetLeft + 200 > document.getElementById('listeBox').offsetWidth)
        {
            index = 1;

            while(document.getElementById('b' + index) != null)
            {
                $("#b" + index).animate({ marginLeft: '-=207px' }, 'slow');
                index++;
            }
        }
    }
}

function versDroiteListeBox()
{
    if (document.getElementById('b1') != undefined && document.getElementById('b1').offsetLeft % 207 == 0) 
    {
        if (document.getElementById('b1').offsetLeft < 0)
        {
            var index = 1;

            while (document.getElementById('b' + index) != null) 
            {
                $("#b" + index).animate({ marginLeft: '+=207px' }, 'slow');
                index++;
            }
        }
    }
}