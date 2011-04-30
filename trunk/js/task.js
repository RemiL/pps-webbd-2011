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
        $('textarea[name="description"]', this.form).val(this.calendarEntry.getContent().getText());
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
        this.calendarEntry.setTitle(google.gdata.atom.Text.create($('input[name="title"]', this.form).val()));
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
        this.calendarEntry.setContent(google.gdata.atom.Text.create($('textarea[name="description"]', this.form).val()));
    },

    create: function (_from)
    {
        this.form = _from;
        this.tabIndex = this.tabs.tabs('option', 'selected');
        this.calendarEntry = new google.gdata.calendar.CalendarEventEntry();
        this.calendarEntry.addTime(new google.gdata.When());
        this.calendarEntry.addLocation(new google.gdata.Where());
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
        
        alert('Edition completed');
    },

    delete: function ()
    {
        this.calendarEntry.deleteEntry(bind(this.onDeleteCompleted, this), bind(this.gestErreur, this));
    },

    onDeleteCompleted: function ()
    {
        delete Task.tasks[this.id];
        this.tabs.tabs('remove',  this.tabs.tabs('option', 'selected'));
        
        // Suppression du calendrier si besoin
        if (this.calendarDOMEntry)
            this.calendar.removeTask(this.calendarDOMEntry);
        
        alert('Deletion completed');
    },

    // Gestionnaire d'erreur
    gestErreur: function (erreur)
    {
        alert(erreur);
    },

    getTitle: function ()
    {
        return this.calendarEntry.getTitle().getText();
    }
}