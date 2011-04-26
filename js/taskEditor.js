function addInput(button) {
    var div = button.parentNode;
    var input = document.createElement("input");
    input.name = "attribut[]";
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