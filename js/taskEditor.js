function addInputActivities(button) {
    var div = button.parentNode;
    var input = document.createElement("input");
    input.name = "activities[]";
    div.removeChild(button);
    div.appendChild(input);
    div.appendChild(button);

    var availableTags = [
    "ActionScript",
    "AppleScript",
    "Asp",
    "BASIC",
    "C",
    "C++",
    "Clojure",
    "COBOL",
    "ColdFusion",
    "Erlang",
    "Fortran",
    "Groovy",
    "Haskell",
    "Java",
    "JavaScript",
    "Lisp",
    "Perl",
    "PHP",
    "Python",
    "Ruby",
    "Scala",
    "Scheme"
    ];
    $(input).autocomplete({
        source: availableTags
    });
}

function addInputDependencies(button) {
    var div = button.parentNode;
    var input = document.createElement("input");
    input.name = "dependencies[]";
    div.removeChild(button);
    div.appendChild(input);
    div.appendChild(button);

    var availableTags = [
    "ActionScript",
    "AppleScript",
    "Asp",
    "BASIC",
    "C",
    "C++",
    "Clojure",
    "COBOL",
    "ColdFusion",
    "Erlang",
    "Fortran",
    "Groovy",
    "Haskell",
    "Java",
    "JavaScript",
    "Lisp",
    "Perl",
    "PHP",
    "Python",
    "Ruby",
    "Scala",
    "Scheme"
    ];
    $(input).autocomplete({
        source: availableTags
    });
}

// Edit une tache
function editTask(form)
{
    alert("eee");
}

//change le format de date
function changeDateType(elem)
{
	elem = elem.parentNode.parentNode.getElementsByTagName("span")[0];
	if(elem.style.visibility == "hidden"){
		elem.style.visibility="visible";
	}
	else{
		elem.style.visibility="hidden";
	}
		
}