$(function() { 
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
		
function addPostit(event)
{
	var y = event.pageY;
	var x = event.pageX;
	var largeur = document.body.clientWidth - 4;
	var postit = document.createElement('div');
	postit.id = 'p' + Number(nbPostit + 1);
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
	
	postit.innerHTML = '<div class="optionsPostit"><span onclick="supprimerPostit(this);" class="ui-icon ui-icon-closethick"></span><span onclick="deriverPostitTache(this);" class="ui-icon ui-icon-document"></span></div><div class="textPostit">Mon premier post-it</div>';
	
	document.getElementById('panneauPostit').appendChild(postit);
	
	$( "#"+postit.id ).draggable({ containment: 'parent' }, { scroll: false }, { stack: ".postit" });
	
	nbPostit++;
}
		
function supprimerPostit(postit)
{
	document.getElementById("panneauPostit").removeChild(postit.parentNode.parentNode);
}

function deriverPostitTache(postit)
{
	afficherCacherPanneauPostit();
	supprimerPostit(postit);
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
	
	document.getElementById('newTask'+index).innerHTML = 'New task'+index;
	
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