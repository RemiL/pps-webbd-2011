function ListBox()
{
    this.list = new Array();
    this.body = null;
}

ListBox.prototype =
{
    setBody: function (body)
    {
        this.body = body;
    },

    fill: function ()
    {
        // TODO crée toutes les box et les remplit de leurs taches
        //*********************************************************
    },

    addBox: function (name)
    {
        var index = Box.nextId;

        for (var i in this.list)
        {
            if (this.list[i].body.offsetLeft < 0)
                index--;
        }

        var divBox = document.createElement('div');
        divBox.className = "box ui-corner-all";
        divBox.style.marginLeft = (index * 207) + 'px';
        this.body.appendChild(divBox);

        var listeTaches = document.createElement('div');
        listeTaches.className = "listeTaches";

        var box = new Box(name, divBox, listeTaches, this);

        var hautBox = document.createElement('div');
        hautBox.className = "hautBox";
        divBox.appendChild(hautBox);

        var optionsBox = document.createElement('div');
        optionsBox.className = "optionsBox";
        hautBox.appendChild(optionsBox);

        var ajouterTacheBox = document.createElement('span');
        ajouterTacheBox.className = "ajouterTacheBox ui-icon ui-icon-plusthick";
        ajouterTacheBox.onclick = function () { box.createTask(); };
        optionsBox.appendChild(ajouterTacheBox);

        var supprimerBox = document.createElement('span');
        supprimerBox.className = "ui-icon ui-icon-closethick";
        supprimerBox.onclick = function () { box.close(); };
        optionsBox.appendChild(supprimerBox);

        var nomBox = document.createElement('div');
        nomBox.className = "nomBox";
        nomBox.appendChild(document.createTextNode(name));
        hautBox.appendChild(nomBox);

        var versHautBox = document.createElement('span');
        versHautBox.className = "deplacerTacheBox ui-icon ui-icon-carat-1-n";
        versHautBox.onclick = function () { box.moveTaskTop(); };
        divBox.appendChild(document.createElement('div').appendChild(versHautBox));

        var corpsBox = document.createElement('div');
        corpsBox.className = "corpsBox";
        divBox.appendChild(corpsBox);
        corpsBox.appendChild(listeTaches);

        var piedBox = document.createElement('div');
        piedBox.className = "piedBox";
        divBox.appendChild(piedBox);
        var boxVersGauche = document.createElement('span');
        boxVersGauche.className = "versGaucheBox ui-icon ui-icon-circle-arrow-w";
        boxVersGauche.onclick = function () { box.moveLeft(); };
        piedBox.appendChild(boxVersGauche);
        var boxVersDroite = document.createElement('span');
        boxVersDroite.className = "versDroiteBox ui-icon ui-icon-circle-arrow-e";
        boxVersDroite.onclick = function () { box.moveRight(); };
        piedBox.appendChild(boxVersDroite);
        var versBasBox = document.createElement('span');
        versBasBox.className = "deplacerTacheBox ui-icon ui-icon-carat-1-s";
        versBasBox.onclick = function () { box.moveTaskBottom(); };
        piedBox.appendChild(versBasBox);

        this.list[name] = box;
        
        // Ajoute la nouvelle activity au fichier xml de sauvegarde
        $.ajax({
            type: 'POST',
            url: 'inc/addActivity.php',
            data: 'id=' + calendarService.getUserId() + '&name=' + name + '&index=' + index,
            async: false,
            success: function (data, status)
            {
                if (data != 1)
                    alert('An error has occured');
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                alert('An error has occured');
            }
        });
        
        return box;
    },

    removeBox: function (name)
    {
        // Supprime l'activity du fichier xml de sauvegarde
        $.ajax({
            type: 'POST',
            url: 'inc/deleteActivity.php',
            data: 'id=' + calendarService.getUserId() + '&index=' + this.list[name].id,
            async: false,
            success: function (data, status)
            {
                if (data != 1)
                    alert('An error has occured');
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                alert('An error has occured');
            }
        });
        
        delete this.list[name];
    },

    getBox: function (name)
    {
        return this.list[name];
    },

    moveLeft: function ()
    {
        var first = null;

        for (var i in this.list)
        {
            if (this.list[i].id == 0)
                first = this.list[i];
        }

        if (first != null && first.body.offsetLeft % 207 == 0)
        {
            if (first.body.offsetLeft < 0)
            {
                for (var i in this.list)
                {
                    $(this.list[i].body).animate({ marginLeft: '+=207px' }, 'slow');
                }
            }
        }
    },

    moveRight: function ()
    {
        var last = null;
        var index = -1;

        for (var i in this.list)
        {
            if (this.list[i].id > index)
            {
                last = this.list[i];
                index = last.id;
            }
        }

        if (last != null && last.body.offsetLeft % 207 == 0)
        {
            if (last.body.offsetLeft + 200 > this.body.offsetWidth)
            {
                for (var i in this.list)
                {
                    $(this.list[i].body).animate({ marginLeft: '-=207px' }, 'slow');
                }
            }
        }
    }

    // Ajouter les méthodes de tri TODO
    //**********************************
}