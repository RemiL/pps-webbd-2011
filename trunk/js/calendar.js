function Calendar(_calendarService)
{
    this.calendarService = _calendarService;
    // On veut récupérer tous les événements depuis le calendrier par défaut
    this.feedUri = 'https://www.google.com/calendar/feeds/default/private/full';
    this.dayOffset = 0;
    // Element HTML correspondant au calendrier dans la page
    this.calendarAgenda = document.getElementById('calendarAgenda');
    // Element HTML correspondant au jour courant dans la page
    this.calendarDay = document.getElementById('calendarDay')
    // Marqueur d'heure courante
    this.calendarNowMarker = document.createElement('div');
    this.calendarNowMarker.id = 'calendarNowMarker';
    this.calendarNowMarker.pos = null;
    this.calendarNowMarker.oldPos = null;
    
    $('#calendarDatePicker').datepicker({'onSelect': bind(this.dateSelected, this)}).hide().click(function(e) { e.stopPropagation(); });
    $('#calendarDay').click(bind(this.showDatePicker, this));
    $('body').click(function() { $('#calendarDatePicker').hide(); });
}

Calendar.prototype =
{
    // Gestionnaire d'erreur
    gestErreur: function (erreur) {
        alert(erreur);
    },

    getTodayStart: function ()
    {
        var d = new Date();
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);
        
        return d;
    },

    getTodayEnd: function ()
    {
        var d = new Date();
        d.setHours(23);
        d.setMinutes(59);
        d.setSeconds(59);
        d.setMilliseconds(999);
        
        return d;
    },

    isDayShown: function (date)
    {
        var dayStart = this.getTodayStart();
        dayStart.setDate(dayStart.getDate() + this.dayOffset);
        var dayEnd = this.getTodayEnd();
        dayEnd.setDate(dayEnd.getDate() + this.dayOffset);
        
        return (dayStart <= date && date <= dayEnd);
    },

    getEvenements: function () {
        if (this.calendarService.isLoggedIn()) {
            // Préparation de la requête
            var query = new google.gdata.calendar.CalendarEventQuery(this.feedUri);

            // On souhaite récupérer les événements du jour
            var dayStart = this.getTodayStart();
            dayStart.setDate(dayStart.getDate() + this.dayOffset);
            var startMin = new google.gdata.DateTime(dayStart);
            var dayEnd = this.getTodayEnd();
            dayEnd.setDate(dayEnd.getDate() + this.dayOffset);
            var startMax = new google.gdata.DateTime(dayEnd);
            query.setMinimumStartTime(google.gdata.DateTime.toIso8601(startMin));
            query.setMaximumStartTime(google.gdata.DateTime.toIso8601(startMax));

            // Envoi de la requête
            this.calendarService.getService().getEventsFeed(query, bind(this.fill, this), bind(this.gestErreur, this));
        }
    },

    getHoraire: function (date) {
        var horaire = date.getHours() + 'h';

        if (date.getHours() < 10)
            horaire = '0' + horaire;
        if (date.getMinutes() < 10)
            horaire = horaire + '0';

        return horaire + date.getMinutes();
    },

    fill: function (root)
    {
        // On vide les éventuelles entrées déjà présentes.
        while (this.calendarAgenda.firstChild)
        {
            if (this.calendarAgenda.firstChild.task)
                this.calendarAgenda.firstChild.task.setCalendarDOMEntry(null);
            this.calendarAgenda.removeChild(this.calendarAgenda.firstChild);
        }
        
        // Les entrées à afficher supposées concerner un seul jour.
        var entries = root.feed.getEntries();

        for (var i = 0; i < entries.length; i++)
            this.createTask(entries[i]);

        this.showNowMarker(this.dayOffset == 0);
    },

    createTask: function(entry)
    {
        var dayStart = this.getTodayStart();
        dayStart.setDate(dayStart.getDate() + this.dayOffset);
        var dayEnd = this.getTodayEnd();
        dayEnd.setDate(dayEnd.getDate() + this.dayOffset);
        
        // Une tâche dans le calendrier
        var task = document.createElement('div');
        task.className = 'tacheCalendar ui-corner-all';
        // On calcule le placement à partir du nombre de minutes depuis minuit (1 pixel = 2 minutes)
        if (dayStart <= entry.getTimes()[0].getStartTime().getDate())
            task.style.top = (entry.getTimes()[0].getStartTime().getDate().getHours() * 60 + entry.getTimes()[0].getStartTime().getDate().getMinutes()) / 2 + 'px';
        else // si la tâche commence au jour précédent
            task.style.top = '0px';
        // On calcule la hauteur à partir de la durée (-1 pour la bordure)
        var height = (entry.getTimes()[0].getEndTime().getDate().getTime() - entry.getTimes()[0].getStartTime().getDate().getTime()) / (60 * 2 * 1000) - 1;
        if (dayStart > entry.getTimes()[0].getStartTime().getDate())
            height -= (dayStart - entry.getTimes()[0].getStartTime().getDate()) / (60 * 2 * 1000);
        else if (entry.getTimes()[0].getEndTime().getDate() > dayEnd)
            height -= (entry.getTimes()[0].getEndTime().getDate() - dayEnd) / (60 * 2 * 1000);
        // On limite la "petitesse" de la tâche
        if (height < 14)
            height = 14;
        task.style.height = height + 'px';

        // L'horaire de la tâche
        var horaire = document.createElement('div');
        horaire.appendChild(document.createTextNode(this.getHoraire(entry.getTimes()[0].getStartTime().getDate()) + ' - ' + this.getHoraire(entry.getTimes()[0].getEndTime().getDate())));
        task.appendChild(horaire);

        // Le titre de la tâche
        var title = document.createElement('div');

        if (parseInt(task.style.height) < 29)
        {
            title.className = 'titreTacheCalendarFloat';
            horaire.className = 'dateTacheCalendarFloat';
        }
        else
        {
            title.className = 'titreTacheCalendar';
            horaire.className = 'dateTacheCalendar';
        }

        title.appendChild(document.createTextNode(entry.getTitle().getText()));
        task.appendChild(title);

        task.task = Task.tasks[Task.getId(entry)];
        if (task.task == undefined)
            task.task = new Task(entry, task);
        else
            task.task.setCalendarDOMEntry(task);
        
        $(task).dblclick(function (e) { this.task.showEditor(); });

        this.calendarAgenda.appendChild(task);
        
        return task;
    },
    
    loadDay: function (step) {
        this.dayOffset += step;
        var day = new Date();
        day.setDate(day.getDate() + this.dayOffset);
        this.calendarDay.innerHTML = day.toLocaleDateString();
        this.getEvenements();
    },

    updateTask: function (entry, task)
    {
        var dayStart = this.getTodayStart();
        dayStart.setDate(dayStart.getDate() + this.dayOffset);
        var dayEnd = this.getTodayEnd();
        dayEnd.setDate(dayEnd.getDate() + this.dayOffset);
        
        var horaire = task.childNodes[0];
        var title = task.childNodes[1];
        
        // On calcule le placement à partir du nombre de minutes depuis minuit (1 pixel = 2 minutes)
        if (dayStart <= entry.getTimes()[0].getStartTime().getDate())
            task.style.top = (entry.getTimes()[0].getStartTime().getDate().getHours() * 60 + entry.getTimes()[0].getStartTime().getDate().getMinutes()) / 2 + 'px';
        else // si la tâche commence au jour précédent
            task.style.top = '0px';
        // On calcule la hauteur à partir de la durée (-1 pour la bordure)
        var height = (entry.getTimes()[0].getEndTime().getDate().getTime() - entry.getTimes()[0].getStartTime().getDate().getTime()) / (60 * 2 * 1000) - 1;
        if (dayStart > entry.getTimes()[0].getStartTime().getDate())
            height -= (dayStart - entry.getTimes()[0].getStartTime().getDate()) / (60 * 2 * 1000);
        else if (entry.getTimes()[0].getEndTime().getDate() > dayEnd)
            height -= (entry.getTimes()[0].getEndTime().getDate() - dayEnd) / (60 * 2 * 1000);
        // On limite la "petitesse" de la tâche
        if (height < 14)
            height = 14;
        task.style.height = height + 'px';
        
        if (parseInt(task.style.height) < 29)
        {
            title.className = 'titreTacheCalendarFloat';
            horaire.className = 'dateTacheCalendarFloat';
        }
        else
        {
            title.className = 'titreTacheCalendar';
            horaire.className = 'dateTacheCalendar';
        }
        
        horaire.innerHTML = this.getHoraire(entry.getTimes()[0].getStartTime().getDate())+' - '+this.getHoraire(entry.getTimes()[0].getEndTime().getDate());
        title.innerHTML = entry.getTitle().getText();
    },

    removeTask: function (task)
    {
        this.calendarAgenda.removeChild(task);
    },

    showNowMarker: function (show) {
        if (show) {
            this.calendarAgenda.appendChild(this.calendarNowMarker);

            this.updateNowMarker();
            setInterval(bind(this.updateNowMarker, this), 30000);
        }
        else
            clearInterval(bind(this.updateNowMarker, this), 30000);
    },

    updateNowMarker: function () {
        var now = new Date();
        
        this.calendarNowMarker.oldPos = this.calendarNowMarker.pos;
        this.calendarNowMarker.pos = (now.getHours() * 60 + now.getMinutes()) / 2;
        this.calendarNowMarker.style.top = this.calendarNowMarker.pos + 'px';
        
        // Changement de jour
        if (this.calendarNowMarker.oldPos > this.calendarNowMarker.pos)
            this.loadDay(0);
    },

    showDatePicker: function (e) {
        e.stopPropagation();
        $('#calendarDatePicker').show().css({ 'left': e.clientX, 'top': e.clientY }).datepicker('setDate', this.dayOffset);
    },

    dateSelected: function (date) {
        $('#calendarDatePicker').hide();
        this.loadDay(Math.ceil((new Date(date) - new Date()) / (24 * 3600 * 1000)) - this.dayOffset);
    }
}