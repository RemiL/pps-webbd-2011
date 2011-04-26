function exportText(form) {
    var idTask = form.parentNode.parentNode.parentNode.id.split('-')[3];
    var text = form.text.value;

    saveText(form);
    window.open('inc/exportText.php?text='+encodeURI(text)+'&name='+idTask, 'pop_up', 'width=300, height=200, toolbar=no status=no');
}

function saveText(form) {
    var idTask = form.parentNode.parentNode.parentNode.id.split('-')[3];
    var text = form.text.value;

    $.ajax({
        type: "POST",
        url: "inc/saveText.php",
        data: "text=" + text + "&name=" + idTask,
        success: function () { // si l'appel a bien fonctionné
            alert("File saved");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("An error has occured");
        }
    });
}