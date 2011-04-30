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
    save: function ()
    {
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
            }
            else
            {
                this.panel.removePostit(this.id);
            }
        }
    },

    createTask: function ()
    {
        addTab(null, null, this.id);
        this.panel.toggle();
    },

    fillEditor: function ()
    {
        $('textarea[name="description"]', $('#formPostit_' + this.id)).val(this.text);
    },

    close: function ()
    {
        this.panel.removePostit(this.id);
    }
}