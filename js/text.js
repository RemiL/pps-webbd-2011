// Sauvegarde le document et l'export pour le télécharger
function exportText(form, id)
{
    var idTask = form.parentNode.parentNode.parentNode.id.split('-')[3];
    var text = form.text.value;
    saveText(form, id);
    window.open('inc/exportText.php?id=' + id + '&name=' + idTask, 'pop_up', 'width=300, height=200, toolbar=no status=no');
}

// Sauvegarde le document
function saveText(form, id)
{
    var idTask = form.parentNode.parentNode.parentNode.id.split('-')[3];
    var text = form.text.value;

    $.ajax({
        type: "POST",
        url: "inc/saveText.php",
        data: "text=" + text + "&name=" + idTask + "&id=" + id,
        success: function (msg)
        {
            if (msg == 1)
                alert("Text saved");
            else
                alert("An error has occured");
        },
        error: function (jqXHR, textStatus, errorThrown)
        {
            alert("An error has occured");
        }
    });
}