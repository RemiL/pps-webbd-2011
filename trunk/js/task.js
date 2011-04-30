function Task(_calendarEntry, _calendarDOMEntry)
{
    this.calendarEntry = _calendarEntry;
    this.calendarDOMEntry = _calendarDOMEntry;
    this.feedUri = this.calendarEntry.getSelfLink().getHref();
    this.id = this.feedUri.substring(this.feedUri.lastIndexOf('/') + 1, this.feedUri.length);
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
        $('input[name="location"]', this.form).val(this.calendarEntry.getLocations()[0].getValueString());
        $('textarea[name="description"]', this.form).val(this.calendarEntry.getContent().getText());
    },

    closeEditor: function ()
    {
        this.tabIndex = null;
    },

    save: function ()
    {
        this.calendarEntry.setTitle(google.gdata.atom.Text.create($('input[name="title"]', this.form).val()));
        var start = $.datepicker.parseDate("mm/dd/yy", $('input[name="beginDate"]', this.form).val());
        start.setHours($('input[name="beginTime"]', this.form).val().split(':')[0]);
        start.setMinutes($('input[name="beginTime"]', this.form).val().split(':')[1]);
        this.calendarEntry.getTimes()[0].setStartTime(start);
        var end = $.datepicker.parseDate("mm/dd/yy", $('input[name="endDate"]', this.form).val());
        end.setHours($('input[name="endTime"]', this.form).val().split(':')[0]);
        end.setMinutes($('input[name="endTime"]', this.form).val().split(':')[1]);
        this.calendarEntry.getTimes()[0].setEndTime(end);
        this.calendarEntry.getLocations()[0].setValueString($('input[name="location"]', this.form).val());
        this.calendarEntry.setContent(google.gdata.atom.Text.create($('textarea[name="description"]', this.form).val()));

        this.calendarEntry.updateEntry(bind(this.onSaveCompleted, this), bind(this.gestErreur, this));
    },
    
    onSaveCompleted: function (root)
    {
        this.calendarEntry = root.entry;
        
        alert('Edition completed');
    },

    // Gestionnaire d'erreur
    gestErreur: function (erreur)
    {
        alert(erreur);
    }
}