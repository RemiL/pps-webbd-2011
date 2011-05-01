function Box(name, body, listTask, panel)
{
    this.name = name;
    this.id = Box.nextId;
    this.list = new Array();
    this.listBody = new Array();
    this.body = body;
    this.listTask = listTask;
    this.panel = panel;

    Box.nextId++;
}

Box.nextId = 0;

Box.prototype =
{
    addTask: function (task)
    {
        // TODO avec les objets task
        //***************************

        //this.list[task.id] = task;

        // ajouter au dom
        var divTask = document.createElement('div');
        divTask.className = "tacheBox ui-corner-all";

        var date = document.createElement('div');
        date.className = "dateTache";
        //date.appendChild(document.createTextNode());

        var titre = document.createElement('div');
        titre.className = "titreTache";
        //titre.appendChild(document.createTextNode(calendarEntry.getTitle().getText()));

        divTask.appendChild(date);
        divTask.appendChild(titre);

        this.listTask.appendChild(divTask);

        //divTask.ondblclick = function () { task.showEditor() };

        //this.listBody[task.id] = divTask;
    },

    removeTask: function (task)
    {
        this.panel.removeChild(listBody[task.id]);
        delete this.listBody[task.id];
        delete this.list[task.id];
    },

    moveLeft: function ()
    {
        if (this.body.offsetLeft % 207 == 0)
        {
            var previous = null;
            for (var i in this.panel.list)
            {
                if (this.panel.list[i].id == (this.id - 1))
                    previous = this.panel.list[i];
            }
            if (previous != null)
            {
                this.body.style.zIndex = 2;
                $(this.body).animate({ marginLeft: '-=207px' }, 'slow');
                previous.body.style.zIndex = 1;
                $(previous.body).animate({ marginLeft: '+=207px' }, 'slow');
                previous.id = this.id;
                this.id--;
            }
        }
    },

    moveRight: function ()
    {
        if (this.body.offsetLeft % 207 == 0)
        {
            var next = null;
            for (var i in this.panel.list)
            {
                if (this.panel.list[i].id == (this.id + 1))
                    next = this.panel.list[i];
            }
            if (next != null)
            {
                this.body.style.zIndex = 2;
                $(this.body).animate({ marginLeft: '+=207px' }, 'slow');
                next.body.style.zIndex = 1;
                $(next.body).animate({ marginLeft: '-=207px' }, 'slow');
                next.id = this.id;
                this.id++;
            }
        }
    },

    moveTaskTop: function ()
    {
        if (this.body.offsetLeft % 207 == 0 && Number($(this.listTask).css("marginTop").replace(/px/, '')) % 44 == 0 && Number($(this.listTask).css("marginTop").replace(/px/, '')) < 0)
        {
            $(this.listTask).animate({ marginTop: '+=44px' }, 'slow');
        }
    },

    moveTaskBottom: function ()
    {
        if (this.body.offsetLeft % 207 == 0 && Number($(this.listTask).css("marginTop").replace(/px/, '')) % 44 == 0 && ($(this.listTask).height() + Number($(this.listTask).css("marginTop").replace(/px/, ''))) > $(".corpsBox", this.body).height())
        {
            $(this.listTask).animate({ marginTop: '-=44px' }, 'slow');
        }
    },

    createTask: function ()
    {
        if (this.body.offsetLeft % 207 == 0)
        {
            addTab(null, null, null, this.name);
        }
    },

    close: function ()
    {
        if (this.body.offsetLeft % 207 == 0)
        {
            // Supprimer cette activity à toutes les taches de la box TODO
            //*************************************************************

            this.panel.body.removeChild(this.body);

            var index = this.id;
            var first;
            for (var i in this.panel.list)
            {
                if (this.panel.list[i].id == 0)
                    first = this.panel.list[i];
            }
            if (first.body.offsetLeft < 0)
            {
                index--;
            }
            else
            {
                index++;
            }

            var boxMove = null;

            for (var i in this.panel.list)
            {
                if (this.panel.list[i].id == index)
                    boxMove = this.panel.list[i];
            }

            if (boxMove != null)
            {
                if (index < this.id)
                {
                    for (var i in this.panel.list)
                    {
                        if (this.panel.list[i].id <= index)
                            $(this.panel.list[i].body).animate({ marginLeft: '+=207px' }, 'slow');
                        else
                            this.panel.list[i].id--;
                    }
                }
                else
                {
                    for (var i in this.panel.list)
                    {
                        if (this.panel.list[i].id >= index)
                        {
                            $(this.panel.list[i].body).animate({ marginLeft: '-=207px' }, 'slow');
                            this.panel.list[i].id--;
                        }
                    }
                }
            }
            Box.nextId--;
            this.panel.removeBox(this.name);
        }
    }
}