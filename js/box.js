// Représente une boîte activity
function Box(name, index, body, listTask, panel)
{
    this.name = name;
    this.id = index;
    this.tasksNumber = 0;
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
    // Ajoute une tâche à la boîte
    addTask: function (task, save)
    {
        if (!this.list[task.id]) // On n'ajoute pas deux fois la même tâche.
        {
            this.list[task.id] = task;
            this.tasksNumber++;

            // ajout au DOM
            var divTask = document.createElement('div');
            divTask.className = "tacheBox ui-corner-all";

            var date = document.createElement('div');
            date.className = "dateTache";
            date.appendChild(document.createTextNode(task.getDate()+' | '+task.getTimeSlot()));

            var titre = document.createElement('div');
            titre.className = "titreTache";
            titre.appendChild(document.createTextNode(task.getTitle()));

            divTask.appendChild(date);
            divTask.appendChild(titre);

            this.listTask.appendChild(divTask);

            divTask.ondblclick = function () { task.showEditor() };

            this.listBody[task.id] = divTask;
            
            // Ajoute la nouvelle tâche à l'activity dans le fichier xml de sauvegarde
            if (save || save == undefined)
            {
                $.ajax({
                    type: 'POST',
                    url: 'inc/addTaskActivity.php',
                    data: 'id=' + calendarService.getUserId() + '&index=' + this.id + '&idTask=' + task.id,
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
            }
        }
    },

    // Met à jour l'affichage d'une task
    updateTask: function (task)
    {
        // Date
        this.listBody[task.id].childNodes[0].innerHTML = task.getDate()+' | '+task.getTimeSlot();
        // Titre
        this.listBody[task.id].childNodes[1].innerHTML = task.getTitle();
    },

    // Supprime une task de la box
    removeTask: function (task)
    {
        this.listTask.removeChild(this.listBody[task.id]);
        delete this.listBody[task.id];
        delete this.list[task.id];
        if (--this.tasksNumber == 0)
            this.close();
        
        // Supprime la tâche de l'activity dans le fichier xml de sauvegarde
        $.ajax({
            type: 'POST',
            url: 'inc/deleteTaskActivity.php',
            data: 'id=' + calendarService.getUserId() + '&index=' + this.id + '&idTask=' + task.id,
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
    },

    // Déplace la box vers la gauche
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
            // Si le déplacement peut se faire
            if (previous != null)
            {
                this.body.style.zIndex = 2;
                $(this.body).animate({ marginLeft: '-=207px' }, 'slow');
                previous.body.style.zIndex = 1;
                $(previous.body).animate({ marginLeft: '+=207px' }, 'slow');

                previous.id = this.id;
                this.id--;

                // Modifie l'index de la box courante dans le fichier xml
                $.ajax({
                    type: "POST",
                    url: "inc/moveActivity.php",
                    data: "id=" + calendarService.getUserId() + "&index=" + previous.id + "&newIndex=" + this.id,
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
        }
    },

    // Déplace la box vers la droite
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
            // Si le déplacement peut se faire
            if (next != null)
            {
                this.body.style.zIndex = 2;
                $(this.body).animate({ marginLeft: '+=207px' }, 'slow');
                next.body.style.zIndex = 1;
                $(next.body).animate({ marginLeft: '-=207px' }, 'slow');

                next.id = this.id;
                this.id++;

                // Modifie l'index de la box courante dans le fichier xml
                $.ajax({
                    type: "POST",
                    url: "inc/moveActivity.php",
                    data: "id=" + calendarService.getUserId() + "&index=" + next.id + "&newIndex=" + this.id,
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
        }
    },

    // Fait défiler les tasks dans la box
    moveTaskTop: function ()
    {
        if (this.body.offsetLeft % 207 == 0 && Number($(this.listTask).css("marginTop").replace(/px/, '')) % 44 == 0 && Number($(this.listTask).css("marginTop").replace(/px/, '')) < 0)
        {
            $(this.listTask).animate({ marginTop: '+=44px' }, 'slow');
        }
    },

    // Fait défiler les tasks dans la box
    moveTaskBottom: function ()
    {
        if (this.body.offsetLeft % 207 == 0 && Number($(this.listTask).css("marginTop").replace(/px/, '')) % 44 == 0 && ($(this.listTask).height() + Number($(this.listTask).css("marginTop").replace(/px/, ''))) > $(".corpsBox", this.body).height())
        {
            $(this.listTask).animate({ marginTop: '-=44px' }, 'slow');
        }
    },

    // Crée une task à partir de l'activity
    createTask: function ()
    {
        if (this.body.offsetLeft % 207 == 0)
        {
            addTab(null, null, null, this.name);
        }
    },

    // Ferme l'activity, supprime toutes traces du tag dans les tasks
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

            // Supprime la box et recolle les autres
            if (boxMove != null)
            {
                // Si la liste des box sort vers la gauche
                // Les box à gauche vont vers la droite
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
                // Sinon ce sont les box de droite qui vont à gauche
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