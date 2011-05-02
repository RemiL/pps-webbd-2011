function Task(_calendarEntry, _calendarDOMEntry)
{
    this.calendarEntry = _calendarEntry;
    this.calendarDOMEntry = _calendarDOMEntry;
    if (_calendarEntry)
    {
        this.feedUri = this.calendarEntry.getSelfLink().getHref();
        this.id = this.feedUri.substring(this.feedUri.lastIndexOf('/') + 1, this.feedUri.length);
    }
    this.tabIndex = null;
    this.form = null;

    // Le type de la tâche
    this.type = null;
    if (_calendarEntry)
    {
        try
        {
            var xmlTask = $.parseXML(this.calendarEntry.getContent().getText());
            this.type = [xmlTask.firstChild.nodeName];
        } catch (e) { }
    }

    // Activities auxquelles la tâche est attachée
    this.activities = new Array();
    if (_calendarEntry)
    {
        try
        {
            // On met à jour les activities pour la première utilisation
            var xmlTask = $.parseXML( this.calendarEntry.getContent().getText() );
            var activities = xmlTask.getElementsByTagName('activity');
            for (var i=0; i<activities.length; i++)
                this.activities.push(activities[i].firstChild.nodeValue);
        } catch (e) { }
    }

    // La tâche est-elle terminée
    this.completed = false;
    if (_calendarEntry)
    {
        try
        {
            var xmlTask = $.parseXML(this.calendarEntry.getContent().getText());
            var completedNode = xmlTask.getElementsByTagName('completed');
            if(completedNode[0].firstChild.nodeValue == 'true')
                this.completed = true;
            else
                this.completed = false;
        } catch (e) { }
    }

    // Sauvegarde pour pouvoir connaitre les changements effectués.
    this.newActivities = null;

    Task.tasks[this.id] = this;
}

// Tableaux stockant toutes les tâches chargées
Task.tasks = new Array();

Task.getId = function (calendarEntry)
{
    var feedUri = calendarEntry.getSelfLink().getHref();

    return feedUri.substring(feedUri.lastIndexOf('/') + 1, feedUri.length);
}

/*
Crée une tâche dans l'optique de l'afficher dans une ou plusieurs box
sans qu'elle soit affichée dans le calendrier.
*/
Task.newTaskForBox = function (id, box)
{
    var task = new Task();

    Task.prototype.calendarService.getService().getEntry('https://www.google.com/calendar/feeds/default/private/full/'+id, bind(task.onTaskForBoxReceived, task, box), bind(task.gestErreur, task), google.gdata.calendar.CalendarEventEntry, true);
}

Task.prototype =
{
    setCalendarDOMEntry: function (_calendarDOMEntry)
    {
        this.calendarDOMEntry = _calendarDOMEntry;
    },

    showEditor: function ()
    {
        if (this.tabIndex == null) // Si on n'a pas d'onglet ouvert pour afficher l'éditeur
            this.tabIndex = addTab(this.calendarEntry.getTitle().getText(), this.id);
        else // sinon on sélectionne l'onglet déjà crée.
            this.tabs.tabs('select', this.tabIndex);
    },

    fillEditor: function ()
    {
        this.form = $('#formTask_' + this.id).get(0);
        /* HACK : Workaround pour un bug de l'API Google :
        * this.calendarService.getService().getCalendarEntry(this.feedUri, bind(this.onDataReceivedFillEditor, this), bind(this.gestErreur, this));
        * ne retourne pas un objet complet, il manque getTimes() ... donc on utilise la fonction générique. */
        this.calendarService.getService().getEntry(this.feedUri, bind(this.onDataReceivedFillEditor, this), bind(this.gestErreur, this), google.gdata.calendar.CalendarEventEntry, true);
    },

    // Remplit le formulaire après que les données aient été reçues.
    onDataReceivedFillEditor: function (root)
    {
        this.calendarEntry = root.entry;

        $('input[name="title"]', this.form).val(this.calendarEntry.getTitle().getText());
        $('input[name="beginDate"]', this.form).val($.datepicker.formatDate("mm/dd/yy", this.calendarEntry.getTimes()[0].getStartTime().getDate()));
        $('input[name="beginTime"]', this.form).val(this.calendarEntry.getTimes()[0].getStartTime().getDate().toTimeString().substr(0, 5));
        $('input[name="endDate"]', this.form).val($.datepicker.formatDate("mm/dd/yy", this.calendarEntry.getTimes()[0].getEndTime().getDate()));
        $('input[name="endTime"]', this.form).val(this.calendarEntry.getTimes()[0].getEndTime().getDate().toTimeString().substr(0, 5));
        // Si les dates sont identiques alors on a une tâche avec une date limite
        if (this.calendarEntry.getTimes()[0].getStartTime().getDate().getTime() == this.calendarEntry.getTimes()[0].getEndTime().getDate().getTime())
        {
            $('select[name="dateType"]', this.form).val('d');
            $('span', this.form).css('visibility', 'hidden');
        }
        $('input[name="location"]', this.form).val(this.calendarEntry.getLocations()[0].getValueString());

        // On essaie de parser le xml qui devrait être contenu à la place de la description
        try
        {
            var xmlTask = $.parseXML(this.calendarEntry.getContent().getText());

            // Le type peut être déterminé grâce au noeud racine.
            this.type = [xmlTask.firstChild.nodeName];
            $('input[name="type"]', this.form).val(this.type);

            $('select[name="priority"]', this.form).val(xmlTask.getElementsByTagName('priority')[0].firstChild.nodeValue);
            $('textarea[name="description"]', this.form).val(xmlTask.getElementsByTagName('description')[0].firstChild.nodeValue);

            // On supprime tous les champs d'activities sauf le premier
            $('input[name="activities[]"]:gt(0)', this.form).remove();
            var activities = xmlTask.getElementsByTagName('activity');
            var button = $('.buttonAddInputActivities', this.form).get(0);
            for (var i = 0; i < activities.length; i++)
            {
                if (i > 0) // Si on a plus d'une activity on rajoute des champs.
                    addInputActivities(button);
                $('input[name="activities[]"]:last', this.form).val(activities[i].firstChild.nodeValue);
            }
        } catch (e) // en cas d'échec, on doit avoir une tâche créée directement avec Calendar, elle sera convertie au prochain enregistrement.
        {
            $('textarea[name="description"]', this.form).val(this.calendarEntry.getContent().getText());
        }

        this.completedForm();
    },

    closeEditor: function ()
    {
        var sav = this.tabIndex;
        this.tabIndex = null;

        return sav;
    },

    updateTabIndexAfterTabClosed: function (closed)
    {
        // Si on est après l'onglet fermé, notre numéro d'onglet est décalé d'un.
        if (this.tabIndex > closed)
            this.tabIndex--;
    },

    // Met à jour la tâche depuis le formulaire.
    updateFromFrom: function ()
    {
        if ($('input[name="title"]', this.form) != null && $('input[name="beginDate"]', this.form) != null)
        {
            this.calendarEntry.getTitle().setText($('input[name="title"]', this.form).val());
            var start = $.datepicker.parseDate("mm/dd/yy", $('input[name="beginDate"]', this.form).val());
            start.setHours($('input[name="beginTime"]', this.form).val().split(':')[0]);
            start.setMinutes($('input[name="beginTime"]', this.form).val().split(':')[1]);
            this.calendarEntry.getTimes()[0].setStartTime(start);
            var end;
            if ($('select[name="dateType"]', this.form).val() == 'w') // créneau horaire
            {
                end = $.datepicker.parseDate("mm/dd/yy", $('input[name="endDate"]', this.form).val());
                end.setHours($('input[name="endTime"]', this.form).val().split(':')[0]);
                end.setMinutes($('input[name="endTime"]', this.form).val().split(':')[1]);
            }
            else // date limite --> tâche "jalon" avec date de fin égale à date de début
                end = start;
            this.calendarEntry.getTimes()[0].setEndTime(end);
            this.calendarEntry.getLocations()[0].setValueString($('input[name="location"]', this.form).val());

            // Consulte tous les champs des activities et crée un tableau contenant le contenu de chacun.
            this.newActivities = $('input[name="activities[]"]', this.form).map(function (i) { if ($(this).val()) return $(this).val(); else { if (i) $(this).remove(); return null; } }).get();

            this.calendarEntry.getContent().setText(xmlToString(this.createXML()));
        }
    },

    createXML: function ()
    {
        var doc = newDocument();
        var taskXML = doc.createElement($('input[name="type"]:checked', this.form).val());
        var title = doc.createElement('title');
        title.appendChild(doc.createTextNode(this.calendarEntry.getTitle().getText()));
        taskXML.appendChild(title);

        var beginDate = doc.createElement('beginDate');
        beginDate.appendChild(doc.createTextNode(google.gdata.DateTime.toIso8601(this.calendarEntry.getTimes()[0].getStartTime())));
        taskXML.appendChild(beginDate);
        var endDate = doc.createElement('endDate');
        endDate.appendChild(doc.createTextNode(google.gdata.DateTime.toIso8601(this.calendarEntry.getTimes()[0].getEndTime())));
        taskXML.appendChild(endDate);

        var location = doc.createElement('location');
        location.appendChild(doc.createTextNode(this.calendarEntry.getLocations()[0].getValueString()));
        taskXML.appendChild(location);

        var priority = doc.createElement('priority');
        priority.appendChild(doc.createTextNode($('select[name="priority"]', this.form).val()));
        taskXML.appendChild(priority);

        var activities = doc.createElement('activities');
        var counts = new Array();
        var activity;
        for (i in this.newActivities)
        {
            if (!counts[this.newActivities[i]]) // on ne veut pas de doublons
            {
                counts[this.newActivities[i]] = 1;

                activity = doc.createElement('activity');
                activity.appendChild(doc.createTextNode(this.newActivities[i]));
                activities.appendChild(activity);
            }
        }
        taskXML.appendChild(activities);

        var completedNode = doc.createElement('completed');
        completedNode.appendChild(doc.createTextNode(new String(this.completed)));
        taskXML.appendChild(completedNode);

        var description = doc.createElement('description');
        description.appendChild(doc.createTextNode($('textarea[name="description"]', this.form).val()));

        taskXML.appendChild(description);

        return taskXML;
    },

    create: function (_from)
    {
        this.form = _from;
        // Quand on valide la création d'une tâche, l'onglet correspondant est celui sélectionné actuellement.
        this.tabIndex = this.tabs.tabs('option', 'selected');
        this.calendarEntry = new google.gdata.calendar.CalendarEventEntry();
        this.calendarEntry.setTitle(new google.gdata.atom.Text());
        this.calendarEntry.addTime(new google.gdata.When());
        this.calendarEntry.addLocation(new google.gdata.Where());
        this.calendarEntry.setContent(new google.gdata.atom.Text());
        this.updateFromFrom();

        this.calendarService.getService().insertEntry(this.calendar.feedUri, this.calendarEntry, bind(this.onCreationCompleted, this), bind(this.gestErreur, this), google.gdata.calendar.CalendarEventEntry);
    },

    onCreationCompleted: function (root)
    {
        this.calendarEntry = root.entry;
        this.feedUri = this.calendarEntry.getSelfLink().getHref();
        this.id = this.feedUri.substring(this.feedUri.lastIndexOf('/') + 1, this.feedUri.length);
        this.form.id = 'form_' + this.id;
        Task.tasks[this.id] = this;

        this.onDataReceivedFillEditor(root);

        // Ajout dans le calendrier si on affiche le jour correspondant à la tâche
        if (this.calendar.isDayShown(this.calendarEntry.getTimes()[0].getStartTime().getDate())
            || this.calendar.isDayShown(this.calendarEntry.getTimes()[0].getEndTime().getDate()))
        {
            this.calendarDOMEntry = this.calendar.createTask(this.calendarEntry);
        }

        // Mise à jour des activities
        this.updateActivities();

        // Crée les onglets en fonction du type de tâche
        if (Task.tasks[this.id].type == 'taskEmail')
        {
            // Crée l'onglet Mail
            $("#" + divContent.id).tabs("add", "inc/mail.php?idTask=" + this.id, "Mail");
        }
        else if(Task.tasks[this.id].type == 'taskDoc')
        {
            // Crée l'onglet Text
            $("#" + divContent.id).tabs("add", "inc/text.php?id=" + calendarService.getUserId() + "&name=" + this.id + "&idTask=" + this.id, "Text");
        }

        // Ajout du bouton de suppression
        var buttonDeleteTaskContainer = document.createElement("li");
        buttonDeleteTaskContainer.className = "ui-state-default ui-corner-top";
        var buttonDeleteTask = document.createElement("a");
        buttonDeleteTask.className = "menuActionTab";
        buttonDeleteTask.href = "#" + this.id;
        buttonDeleteTask.onclick = function (event) { deleteTask(this); event.preventDefault(); event.stopPropagation(); };
        buttonDeleteTask.appendChild(document.createTextNode("Delete"));
        buttonDeleteTaskContainer.appendChild(buttonDeleteTask);
        this.form.parentNode.parentNode.parentNode.getElementsByTagName('ul')[0].appendChild(buttonDeleteTaskContainer);

        // Ajout du bouton completed
        var buttonCompletedTaskContainer = document.createElement("li");
        buttonCompletedTaskContainer.className = "ui-state-default ui-corner-top";
        var buttonCompletedTask = document.createElement("a");
        buttonCompletedTask.className = "menuActionTab";
        buttonCompletedTask.href = "#" + this.id;
        buttonCompletedTask.onclick = function (event) { markAsCompletedTask(this); event.preventDefault(); event.stopPropagation(); };
        buttonCompletedTask.appendChild(document.createTextNode("Completed"));
        buttonCompletedTaskContainer.appendChild(buttonCompletedTask);
        this.form.parentNode.parentNode.parentNode.getElementsByTagName('ul')[0].appendChild(buttonCompletedTaskContainer);

        alert('Creation completed');
    },

    update: function ()
    {
        this.updateFromFrom();

        this.calendarEntry.updateEntry(bind(this.onUpdateCompleted, this), bind(this.gestErreur, this));
    },

    onUpdateCompleted: function (root)
    {
        this.calendarEntry = root.entry;

        this.onDataReceivedFillEditor(root);

        // Mise à jour dans le calendrier si besoin
        if (this.calendarDOMEntry)
            this.calendar.updateTask(this.calendarEntry, this.calendarDOMEntry);

        // Mise à jour des activities
        this.updateActivities();

        alert('Edition completed');
    },

    remove: function ()
    {
        this.calendarEntry.deleteEntry(bind(this.onRemoveCompleted, this), bind(this.gestErreur, this));
        // On enlève les activities de la tâche.
        this.newActivities = new Array();
    },

    complete: function ()
    {
        this.completed = true;
        this.update();

        $('ul li:last-child', this.form.parentNode.parentNode.parentNode).remove();

        alert("Task completed");
    },

    onRemoveCompleted: function ()
    {
        delete Task.tasks[this.id];
        this.tabs.tabs('remove', this.tabs.tabs('option', 'selected'));

        // Suppression du calendrier si besoin
        if (this.calendarDOMEntry)
            this.calendar.removeTask(this.calendarDOMEntry);

        // Mise à jour des activities
        this.updateActivities();

        alert('Deletion completed');
    },

    updateActivities: function ()
    {
        var box;

        // Attache la tâche aux activities
        for (i in this.newActivities)
        {
            if ($.inArray(this.newActivities[i], this.activities) == -1)
            { // Nouvelle activity pour cette tâche
                box = this.boxList.getBox(this.newActivities[i])
                if (!box)
                    box = this.boxList.addBox(this.newActivities[i]);

                box.addTask(this);
            }
            else // On met à jour
                this.boxList.getBox(this.newActivities[i]).updateTask(this);
        }

        // Suppression de la tâche des activities plus utilisées
        for (i in this.activities)
        {
            if ($.inArray(this.activities[i], this.newActivities) == -1)
                this.boxList.getBox(this.activities[i]).removeTask(this);
        }

        this.activities = this.newActivities;
    },

    onTaskForBoxReceived: function (box, root)
    {
        this.calendarEntry = root.entry;
        this.feedUri = this.calendarEntry.getSelfLink().getHref();
        this.id = this.feedUri.substring(this.feedUri.lastIndexOf('/') + 1, this.feedUri.length);

        /* HACK : L'API Google n'est pas synchrone et on ne peut pas forcer
        * son utilisation pour qu'elle le soit, on essaie de contourner ce
        * problème en vérifiant qu'à l'instant T où la tâche est reçue elle
        * n'a pas déjà été créée par ailleurs. */
        if (Task.tasks[this.id] == undefined)
        {
            Task.tasks[this.id] = this;

            // On met à jour les activities pour la première utilisation
            try
            {
                var xmlTask = $.parseXML(this.calendarEntry.getContent().getText());
                var activities = xmlTask.getElementsByTagName('activity');
                for (var i = 0; i < activities.length; i++)
                    this.activities.push(activities[i].firstChild.nodeValue);
            } catch (e) { }
            box.addTask(this, false);
        }
        else // On utilise la tâche précédement créée.
            box.addTask(Task.tasks[this.id], false);
    },

    completedForm: function ()
    {
        if (this.completed)
        {
            $('input[value!="Export"]', this.form.parentNode.parentNode.parentNode).attr("disabled", true);
            $('textarea', this.form.parentNode.parentNode.parentNode).attr("disabled", true);
            $('select', this.form.parentNode.parentNode.parentNode).attr("disabled", true);
            $('.buttonAddInput', this.form.parentNode.parentNode.parentNode).remove();
        }
    },

    // Gestionnaire d'erreur
    gestErreur: function (erreur)
    {
        alert(erreur);
    },

    getTitle: function ()
    {
        return this.calendarEntry.getTitle().getText();
    },

    getDate: function ()
    {
        return $.datepicker.formatDate("mm/dd/yy", this.calendarEntry.getTimes()[0].getStartTime().getDate());
    },

    getTimeSlot: function ()
    {
        var timeSlot = this.calendarEntry.getTimes()[0].getStartTime().getDate().toTimeString().substr(0, 5);

        if (this.calendarEntry.getTimes()[0].getStartTime().getDate().getTime() != this.calendarEntry.getTimes()[0].getEndTime().getDate().getTime())
            timeSlot += ' - ' + this.calendarEntry.getTimes()[0].getEndTime().getDate().toTimeString().substr(0, 5);

        return timeSlot;
    }
}