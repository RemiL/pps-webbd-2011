function Panel(body)
{
    this.list = new Array();
    this.body = body;
    this.postit = null;
}

Panel.prototype =
{
    addPostit: function (event)
    {
        // sauvegarde le dernier postit ajouté
        if (this.postit != null)
            this.postit.save();

        var y = event.pageY;
        var x = event.pageX;
        var largeur = document.body.clientWidth - 4;
        var hauteur = 748;
        var postit = document.createElement('div');
        postit.className = 'postit ui-corner-all';

        var objPostit = new PostIt(this, postit);
        this.postit = objPostit;

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

        $(postit).draggable({ containment: 'parent' }, { scroll: false }, { stack: ".postit" });
    },

    validPostit: function ()
    {
        this.list.push(this.postit);
        this.postit = null;
    },

    toggle: function ()
    {
        if (this.body.style.visibility != 'visible')
            this.body.style.visibility = 'visible';
        else
            this.body.style.visibility = 'hidden';
    },

    removePostit: function (postit)
    {
        this.list.splice(postit.id, 1);
        this.body.removeChild(postit.body);
    }
}