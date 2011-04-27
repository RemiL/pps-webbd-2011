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

Task.getId = function(calendarEntry)
{
  var feedUri = calendarEntry.getSelfLink().getHref();
  
  return feedUri.substring(feedUri.lastIndexOf('/') + 1, feedUri.length);
}

Task.prototype =
{
    showEditor: function() {
        if (this.tabIndex == null)
            this.tabIndex = addTab(this.calendarEntry.getTitle().getText(), this.id);
        else
            this.tabs.tabs('select', this.tabIndex);
    },
    
    fillEditor: function() {
        this.form = $('#form_'+this.id);
        this.calendarService.getService().getCalendarEntry(this.feedUri, bind(this.onDataReceivedFillEditor, this), bind(this.gestErreur, this));
    },
    
    onDataReceivedFillEditor: function(root) {
        this.calendarEntry = root.entry;
        $('input[name="title"]', this.form).val(this.calendarEntry.getTitle().getText());
        $('textarea[name="description"]', this.form).val(this.calendarEntry.getContent().getText());
    },
    
    closeEditor: function() {
        this.tabIndex = null;
    },
    
    save: function() {
        this.calendarEntry.setTitle(google.gdata.atom.Text.create($('input[name="title"]', this.form).val()));
        this.calendarEntry.setContent(google.gdata.atom.Text.create($('textarea[name="description"]', this.form).val()));
        // TBC
        
        this.calendarEntry.updateEntry(function() { alert('Edition completed'); });
    },
    
    // Gestionnaire d'erreur
    gestErreur: function(erreur) {
        alert(erreur);
    }
}