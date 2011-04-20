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

    getEvenements: function () {
        if (this.calendarService.isLoggedIn()) {
            // Préparation de la requête
            var query = new google.gdata.calendar.CalendarEventQuery(this.feedUri);

            // On souhaite récupérer les événements du jour
            var day_start = new Date();
            day_start.setDate(day_start.getDate() + this.dayOffset);
            day_start.setHours(0);
            day_start.setMinutes(0);
            day_start.setSeconds(0);
            day_start.setMilliseconds(0);
            var startMin = new google.gdata.DateTime(day_start);
            var day_end = new Date();
            day_end.setDate(day_end.getDate() + this.dayOffset);
            day_end.setHours(23);
            day_end.setMinutes(59);
            day_end.setSeconds(59);
            day_end.setMilliseconds(999);
            var startMax = new google.gdata.DateTime(day_end);
            query.setMinimumStartTime(google.gdata.DateTime.toIso8601(startMin));
            query.setMaximumStartTime(google.gdata.DateTime.toIso8601(startMax));

            // Envoi de la requête
            this.calendarService.getService().getEventsFeed(query, bind(this.remplir, this), bind(this.gestErreur, this));
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

    remplir: function (root) {
        // On vide les éventuelles entrées déjà présentes.
        while (this.calendarAgenda.firstChild)
            this.calendarAgenda.removeChild(this.calendarAgenda.firstChild);

        // Les entrées à afficher supposées concerner un seul jour.
        var entrees = root.feed.getEntries();

        if (entrees.length > 0) {
            // Une tâche dans le calendrier
            var tache;
            // L'horaire de la tache
            var horaire;
            // Le titre de la tache
            var titre;
            
            var entree, id;
            for (var i = 0; i < entrees.length; i++) {
                entree = entrees[i];

                tache = document.createElement('div');
                tache.className = 'tacheCalendar ui-corner-all';
                // On calcule le placement à partir du nombre de minutes depuis minuit (1 pixel = 2 minutes)
                tache.style.top = (entree.getTimes()[0].getStartTime().getDate().getHours() * 60 + entree.getTimes()[0].getStartTime().getDate().getMinutes()) / 2 + 'px';
                // On calcule la hauteur à partir de la durée
                tache.style.height = (entree.getTimes()[0].getEndTime().getDate().getTime() - entree.getTimes()[0].getStartTime().getDate().getTime()) / (60 * 2 * 1000) - 1 + 'px';

                horaire = document.createElement('div');
                horaire.className = 'dateTache';
                horaire.appendChild(document.createTextNode(this.getHoraire(entree.getTimes()[0].getStartTime().getDate()) + ' - ' + this.getHoraire(entree.getTimes()[0].getEndTime().getDate())));
                tache.appendChild(horaire);

                titre = document.createElement('div');
                titre.className = 'titreTacheCalendar';
                titre.appendChild(document.createTextNode(entree.getTitle().getText()));
                tache.appendChild(titre);
                
                tache.task = new Task(entree, tache);
                $(tache).dblclick(function (e) { this.task.showEditor(); });

                this.calendarAgenda.appendChild(tache);
            }
        }

        this.showNowMarker(this.dayOffset == 0);
    },

    loadDay: function (step) {
        this.dayOffset += step;
        var day = new Date();
        day.setDate(day.getDate() + this.dayOffset);
        this.calendarDay.innerHTML = day.toLocaleDateString();
        this.getEvenements();
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

        this.calendarNowMarker.style.top = (now.getHours() * 60 + now.getMinutes()) / 2 + 'px';
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