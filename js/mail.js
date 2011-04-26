function sendMail(form, from) {
    var recipient = form.recipient.value;
    var object = form.object.value;
    var content = form.content.value;
    var idTask = form.parentNode.parentNode.parentNode.id.split('-')[3];

    $.ajax({
        type: "POST",
        url: "inc/sendmail.php",
        data: "from=" + from + "&recipient=" + recipient + "&object=" + object + "&content=" + content,
        success: function () { // si l'appel a bien fonctionné
            // Mettre la tache en fini
            alert("Mail send");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("An error has occured");
        }
    });
}