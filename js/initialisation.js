$(function() {
			$( "#action" ).tabs();
			$("#postit").button();
		});

function fermerOnglet(index)
{
	for(var i=index+1; i<$( "#action" ).tabs( "length" ); i++)
	{
		var id = 'ongletTache'+i;
		var id2 = i - 1;
		var tab = document.getElementById(id);
		tab.id = 'ongletTache'+id2;
		tab.onclick = "fermerOnglet(" + id2 + ");";
	}

	$( "#action" ).tabs( "remove" , index );
}