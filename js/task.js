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

    // Activities auxquelles la tâche est attachée
    this.activities = new Array();
    // Sauvegarde
    this.newActivities = null;

    Task.tasks[this.id] = this;
}

Task.tasks = new Array();

Task.getId = function (calendarEntry)
{
    var feedUri = calendarEntry.getSelfLink().getHref();

    return feedUri.substring(feedUri.lastIndexOf('/') + 1, feedUri.length);
}

Task.prototype =
{
    setCalendarDOMEntry: function(_calendarDOMEntry)
    {
        this.calendarDOMEntry = _calendarDOMEntry;
    },

    showEditor: function ()
    {
        if (this.tabIndex == null)
            this.tabIndex = addTab(this.calendarEntry.getTitle().getText(), this.id);
        else
            this.tabs.tabs('select', this.tabIndex);
    },

    fillEditor: function ()
    {
        this.form = $('#formTask_' + this.id);
        /* Workaround pour un bug de l'API Google :
         * this.calendarService.getService().getCalendarEntry(this.feedUri, bind(this.onDataReceivedFillEditor, this), bind(this.gestErreur, this));
         * ne retourne pas un objet complet, il manque getTimes() ... donc on utilise la fonction générique */
        this.calendarService.getService().getEntry(this.feedUri, bind(this.onDataReceivedFillEditor, this), bind(this.gestErreur, this), google.gdata.calendar.CalendarEventEntry, true);
    },

    onDataReceivedFillEditor: function (root)
    {
        this.calendarEntry = root.entry;
        
        $('input[name="title"]', this.form).val(this.calendarEntry.getTitle().getText());
        $('input[name="beginDate"]', this.form).val($.datepicker.formatDate("mm/dd/yy", this.calendarEntry.getTimes()[0].getStartTime().getDate()));
        $('input[name="beginTime"]', this.form).val(this.calendarEntry.getTimes()[0].getStartTime().getDate().toTimeString().substr(0, 5));
        $('input[name="endDate"]', this.form).val($.datepicker.formatDate("mm/dd/yy", this.calendarEntry.getTimes()[0].getEndTime().getDate()));
        $('input[name="endTime"]', this.form).val(this.calendarEntry.getTimes()[0].getEndTime().getDate().toTimeString().substr(0, 5));
        // Si les dates sont identiques alors on a un tâche avec une date limite
        if (this.calendarEntry.getTimes()[0].getStartTime().getDate().getTime() == this.calendarEntry.getTimes()[0].getEndTime().getDate().getTime())
        {
            $('select[name="dateType"]', this.form).val('d');
            $('span', this.form).css('visibility', 'hidden');
        }
        $('input[name="location"]', this.form).val(this.calendarEntry.getLocations()[0].getValueString());
        
        var xmlTask = $.parseXML( this.calendarEntry.getContent().getText() );
        $('select[name="priority"]', this.form).val(xmlTask.getElementsByTagName('priority')[0].innerHTML)
        $('textarea[name="description"]', this.form).val(xmlTask.getElementsByTagName('description')[0].innerHTML)
        
        // On supprime tous les champs d'activities sauf le premier
        $('input[name="activities[]:gt(0)"]', this.form).remove();
        var activities = xmlTask.getElementsByTagName('activity');
        var button = $('.buttonAddInputActivities', this.form).get(0);
        for (var i=0; i<activities.length; i++)
        {
            if (i > 0) // Si on a plus d'une activity on rajoute des champs.
                addInputActivities(button);
            $('input[name="activities[]"]:last', this.form).val(activities[i].innerHTML);
        }
    },

    closeEditor: function ()
    {
        var sav = this.tabIndex;
        this.tabIndex = null;
        
        return sav;
    },

    updateTabIndexAfterTabClosed: function (closed)
    {
        if (this.tabIndex > closed)
            this.tabIndex--;
    },

    updateFromFrom: function ()
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
        
        this.newActivities = $('input[name="activities[]"]', this.form).map( function(i) { if ($(this).val()) return $(this).val(); else { if (i) $(this).remove(); return null; } } ).get();
        
        this.calendarEntry.getContent().setText(xmlToString(this.createXML()));
    },

    createXML: function()
    {
        var taskXML = document.createElement('task');
        var title = document.createElement('title');
        title.appendChild(document.createTextNode(this.calendarEntry.getTitle().getText()));
        taskXML.appendChild(title);
        
        var beginDate = document.createElement('beginDate');
        beginDate.appendChild(document.createTextNode(google.gdata.DateTime.toIso8601(this.calendarEntry.getTimes()[0].getStartTime())));
        taskXML.appendChild(beginDate);
        var endDate = document.createElement('endDate');
        endDate.appendChild(document.createTextNode(google.gdata.DateTime.toIso8601(this.calendarEntry.getTimes()[0].getEndTime())));
        taskXML.appendChild(endDate);
        
        var location = document.createElement('location');
        location.appendChild(document.createTextNode(this.calendarEntry.getLocations()[0].getValueString()));
        taskXML.appendChild(location);
        
        var priority = document.createElement('priority');
        priority.appendChild(document.createTextNode($('select[name="priority"]', this.form).val()));
        taskXML.appendChild(priority);
        
        var activities = document.createElement('activities');
        var counts = new Array();
        var activity;
        for (i in this.newActivities)
        {
            if (!counts[this.newActivities[i]]) // on ne veut pas de doublons
            {
                counts[this.newActivities[i]] = 1;
                
                activity = document.createElement('activity');
                activity.appendChild(document.createTextNode(this.newActivities[i]));
                activities.appendChild(activity);
            }
        }
        taskXML.appendChild(activities);
        
        var description = document.createElement('description');
        description.appendChild(document.createTextNode($('textarea[name="description"]', this.form).val()));
        taskXML.appendChild(description);
        
        return taskXML;
    },

    create: function (_from)
    {
        this.form = _from;
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
        this.form.id = 'form_'+this.id;
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
        
        // Ajout du bouton de suppression
        var buttonDeleteTaskContainer = document.createElement("li");
        buttonDeleteTaskContainer.className = "ui-state-default ui-corner-top";
        var buttonDeleteTask = document.createElement("a");
        buttonDeleteTask.className = "menuActionTab";
        buttonDeleteTask.href = "#"+this.id;
        buttonDeleteTask.onclick = function() { deleteTask(this); event.preventDefault(); event.stopPropagation(); };
        buttonDeleteTask.appendChild(document.createTextNode("Delete"));
        buttonDeleteTaskContainer.appendChild(buttonDeleteTask);
        this.form.parentNode.parentNode.parentNode.getElementsByTagName('ul')[0].appendChild(buttonDeleteTaskContainer);
        
        alert('Creation completed');
    },
    
    update: function ()
    {
        this.tabIndex = this.tabs.tabs('option', 'selected');
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

    delete: function ()
    {
        this.calendarEntry.deleteEntry(bind(this.onDeleteCompleted, this), bind(this.gestErreur, this));
        // On enlève les activities de la tâche.
        this.newActivities = new Array();
    },

    onDeleteCompleted: function ()
    {
        delete Task.tasks[this.id];
        this.tabs.tabs('remove',  this.tabs.tabs('option', 'selected'));
        
        // Suppression du calendrier si besoin
        if (this.calendarDOMEntry)
            this.calendar.removeTask(this.calendarDOMEntry);
        
        // Mise à jour des activities
        this.updateActivities();
        
        alert('Deletion completed');
    },

    updateActivities: function()
    {
        var box;
        
        // Attache la tâche aux activities
        for (i in this.newActivities)
        {
            if ($.inArray(this.newActivities[i], this.activities) == -1)
            {
                box = this.boxList.getBox(this.newActivities[i])
                if (!box)
                    box = this.boxList.addBox(this.newActivities[i]);
                
                box.addTask(this);
            }
        }
        
        // Suppression de la tâche des activities plus utilisées
        for (i in this.activities)
        {
            if ($.inArray(this.activities[i], this.newActivities) == -1)
                this.boxList.getBox(this.activities[i]).removeTask(this);
        }
        
        this.activities = this.newActivities;
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

    getTimeSlot: function ()
    {
        var timeSlot = this.calendarEntry.getTimes()[0].getStartTime().getDate().toTimeString().substr(0, 5);
        
        if (this.calendarEntry.getTimes()[0].getStartTime().getDate().getTime() != this.calendarEntry.getTimes()[0].getEndTime().getDate().getTime())
            timeSlot += ' - ' + this.calendarEntry.getTimes()[0].getEndTime().getDate().toTimeString().substr(0, 5);
        
        return timeSlot;
    }
}