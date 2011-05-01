function Panel()
{
    this.list = new Array();
    this.body = null;
    this.postit = null;
}

Panel.prototype =
{
    // Ajoute un post it à éditer
    addPostit: function (event)
    {
        // sauvegarde le dernier postit à éditer (il ne peut y en avoir qu'un à éditer)
        if (this.postit != null)
            this.postit.save();

        var y = event.pageY;
        var x = event.pageX;
        var largeur = document.body.clientWidth - 4;
        var hauteur = 748;
        var postit = document.createElement('div');
        postit.className = 'postit ui-corner-all';

        // Crée un objet postit
        var objPostit = new PostIt(this, postit, "", false);
        this.postit = objPostit;

        // Positionne le postit pour qu'il ne sorte pas du panneau
        if (y < 150 / 2)
        {
            postit.style.top = 0 + "px";
        }
        else if (y > hauteur - 150 / 2)
        {
            postit.style.top = hauteur - 150 + "px";
        }
        else
        {
            postit.style.top = event.pageY - 8 - 150 / 2 + "px";
        }

        if (x < 200 / 2)
        {
            postit.style.left = 0 + "px";
        }
        else if (x > largeur - 200 / 2)
        {
            postit.style.left = largeur - 200 + "px";
        }
        else
        {
            postit.style.left = event.pageX - 8 - 200 / 2 + "px";
        }

        // Ajoute le postit à éditer au DOM
        var options = document.createElement('div');
        options.className = 'optionsPostit';

        var supprimer = document.createElement('span');
        supprimer.className = 'ui-icon ui-icon-closethick';
        supprimer.onclick = function () { objPostit.close(); };

        var zoneText = document.createElement('div');
        zoneText.className = 'textPostit';

        var textarea = document.createElement('textarea');
        textarea.id = "nouveauTextePostit";
        textarea.name = "textPostit";
        textarea.cols = '13';
        textarea.rows = '8';
        var input = document.createElement('input');
        input.type = 'submit';
        input.id = 'collerPostit';
        input.value = 'Coller';
        input.onclick = function () { objPostit.save(); };

        options.appendChild(supprimer);

        zoneText.appendChild(textarea);
        zoneText.appendChild(input);

        postit.appendChild(options);
        postit.appendChild(zoneText);

        document.getElementById('panneauPostit').appendChild(postit);
        document.getElementById('nouveauTextePostit').focus();

        // Le postit est maintenant draggable
        $(postit).draggable({ containment: 'parent' }, { scroll: false }, { stack: ".postit" }, { stop: function () { objPostit.saveMove(); } });
    },

    // Ajoute un postit venant du fichier xml
    loadPostit: function (text, x, y)
    {
        // Ajoute le postit au DOM
        var postit = document.createElement('div');
        postit.className = 'postit ui-corner-all';

        postit.style.left = x + 'px';
        postit.style.top = y + 'px';

        var objPostit = new PostIt(this, postit, text, true);

        var options = document.createElement('div');
        options.className = 'optionsPostit';

        var supprimer = document.createElement('span');
        supprimer.className = 'ui-icon ui-icon-closethick';
        supprimer.onclick = function () { objPostit.close(); };

        var deriver = document.createElement('span');
        deriver.className = 'ui-icon ui-icon-document';
        deriver.onclick = function () { objPostit.createTask(); };

        var zoneText = document.createElement('div');
        zoneText.className = 'textPostit';

        // Ajoute le texte
        var tabText = text.split('\n');
        for (var i = 0; i < tabText.length; i++)
        {
            zoneText.appendChild(document.createTextNode(tabText[i]));
            zoneText.appendChild(document.createElement('br'));
        }

        options.appendChild(supprimer);
        options.appendChild(deriver);

        postit.appendChild(options);
        postit.appendChild(zoneText);

        document.getElementById('panneauPostit').appendChild(postit);

        // Le postit est maintenant draggable
        $(postit).draggable({ containment: 'parent' }, { scroll: false }, { stack: ".postit" }, { stop: function () { objPostit.saveMove(); } });

        this.list[objPostit.id] = objPostit;
    },

    // Valide le postit en cours de création
    validPostit: function ()
    {
        this.list[this.postit.id] = this.postit;
        this.postit = null;
    },

    // Affiche ou cache le panneau de postit
    toggle: function ()
    {
        if (this.body.style.visibility != 'visible')
            this.body.style.visibility = 'visible';
        else
            this.body.style.visibility = 'hidden';
    },

    // Supprime un postit
    removePostit: function (id)
    {
        // Si le postit n'est pas encore validé
        if (this.postit != null && id == this.postit.id)
        {
            this.body.removeChild(this.postit.body);
            this.postit = null;
        }
        // Si le postit est validé
        else
        {
            this.body.removeChild(this.list[id].body);

            // Supprime le postit dans le fichier xml
            $.ajax({
                type: "POST",
                url: "inc/deletePostit.php",
                data: "id=" + calendarService.getUserId() + "&idPostit=" + id,
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

            delete this.list[id];

            // Modifie les id des postit pour qu'il corresponde à la bonne entrée xml
            var list2 = new Array();
            for (var i in this.list)
            {
                if (Number(i) > Number(id))
                {
                    var newId = new String(Number(i - 1));
                    this.list[i].id--;
                    list2[newId] = this.list[i];
                    delete this.list[i];
                }
            }
            for (var i in list2)
            {
                this.list[i] = list2[i];
            }
        }
    },

    // Change la valeur du corps dans le DOM du panneau
    setBody: function (body)
    {
        this.body = body;
    }
}