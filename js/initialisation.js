$(function() { 
			$("#action").tabs({ tabTemplate: '<li>#{label}</li>' });
			$("#afficherPostit").button({ icons: {primary:'ui-icon-circle-triangle-n'}, text: false });
			$("#ajouterOnglet").button({ icons: {primary:'ui-icon-plusthick'}, text: false });
			$("#ajouterOnglet").click(function() { addTab(); });
			$("#afficherPostit").click(function() { afficherCacherPanneauPostit(); });
			$( "#postit1" ).draggable({ containment: 'parent' }, { scroll: false });
		});

var panneauPostitOuvert = false;
		
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
	var index = Number(onglet.id.charAt(1));
	for(var i=index+1; i<$( "#action" ).tabs( "length" ); i++)
	{
		document.getElementById('i'+i).id = 'i' + (i - 1);
	}

	$( "#action" ).tabs( "remove" , index );
}