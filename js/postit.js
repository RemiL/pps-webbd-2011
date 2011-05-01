function PostIt(panel, body, text, valid)
{
    this.id = String(PostIt.nbPostit);
    this.panel = panel;
    this.body = body;
    this.text = text;
    this.valid = valid;
    PostIt.nbPostit++;
}

PostIt.nbPostit = 0;

PostIt.prototype =
{
    // Sauvegarde le postit
    save: function ()
    {
        // Si le postit n'a pas déjà été validé, on peut l'enregistrer
        if (!this.valid)
        {
            var text1 = $('textarea[name="textPostit"]', this.body).val();

            // si le texte est vide, le postit est supprimé
            if (text1 != "")
            {
                this.text = text1;

                // Supprime le formulaire
                $('textarea', this.body).remove();
                $('input', this.body).remove();

                // Ajoute le texte
                var tabText = this.text.split('\n');
                for (var i = 0; i < tabText.length; i++)
                {
                    $('.textPostit', this.body).append(document.createTextNode(tabText[i]));
                    $('.textPostit', this.body).append(document.createElement('br'));
                }

                // Ajoute le bouton pour dériver en tâche
                var deriver = document.createElement('span');
                deriver.className = 'ui-icon ui-icon-document';
                deriver.onclick = bind(function () { this.createTask(); }, this);
                this.body.firstChild.appendChild(deriver);

                // Vérifie la hauteur pour ne pas sortir du cadre
                var hauteur = 750;
                var y = this.body.offsetTop + this.body.offsetHeight;
                if (y > hauteur)
                {
                    this.body.style.top = hauteur - this.body.offsetHeight + "px";
                }

                this.valid = true;
                this.panel.validPostit();

                // Ajoute l'entrée au fichier xml
                $.ajax({
                    type: "POST",
                    url: "inc/addPostit.php",
                    data: "id=" + calendarService.getUserId() + "&idPostit=" + this.id + "&text=" + this.text + "&x=" + this.body.style.left.replace(/px/, '') + "&y=" + this.body.style.top.replace(/px/, ''),
                    success: function (data, status)
                    {
                        if (data != 1)
                            alert("An error has occured");
                    },
                    error: function (jqXHR, textStatus, errorThrown)
                    {
                        alert("An error has occured");
                    }
                });
            }
            else
            {
                this.panel.removePostit(this.id);
            }
        }
    },

    // Dérive le postit en tâche
    createTask: function ()
    {
        // Crée un nouvel onglet et ferme le panneau
        addTab(null, null, this.id);
        this.panel.toggle();
    },

    // Remplit le formulaire d'édition de tâche avec les informations du postit
    fillEditor: function ()
    {
        $('textarea[name="description"]', $('#formPostit_' + this.id)).val(this.text);
    },

    // Sauvegarde la position du postit
    saveMove: function ()
    {
        // Modifie la position dans le fichier xml
        $.ajax({
            type: "POST",
            url: "inc/movePostit.php",
            data: "id=" + calendarService.getUserId() + "&idPostit=" + this.id + "&x=" + this.body.style.left.replace(/px/, '') + "&y=" + this.body.style.top.replace(/px/, ''),
            success: function (data, status)
            {
                if (data != 1)
                    alert("An error has occured");
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                alert("An error has occured");
            }
        });
    },

    // Ferme le postit
    close: function ()
    {
        this.panel.removePostit(this.id);
    }
}