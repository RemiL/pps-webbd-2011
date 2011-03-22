$(function() { 
			$("#action").tabs();
			$("#postit").button();
		});

function fermerOnglet(onglet)
{
	var index = Number(onglet.id);
	for(var i=index+1; i<$( "#action" ).tabs( "length" ); i++)
	{
		document.getElementById(i).id = i - 1;
	}

	$( "#action" ).tabs( "remove" , index );
}