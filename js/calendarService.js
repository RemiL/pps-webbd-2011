/*
Surcouche pour l'objet de l'API Google du même nom.
*/
function CalendarService(autoconnect)
{
    // Objet de l'API Google
    this.calendarService = null;
    this.scope = 'https://www.google.com/calendar/feeds/';
    this.appName = 'PPS-OneThingAtATime-0.1';
    this.feedUri = 'https://www.google.com/calendar/feeds/default/owncalendars/full';
    this.userId = null;
    
    if (autoconnect == true || autoconnect == undefined)
        this.connect();
}

CalendarService.prototype =
{
    connect: function ()
    {
        this.calendarService = new google.gdata.calendar.CalendarService(this.appName);

        if (google.accounts.user.getStatus(this.scope) == google.accounts.AuthSubStatus.LOGGED_OUT)
            var token = google.accounts.user.login(this.scope);
        else
            this.calendarService.getOwnCalendarsFeed(this.feedUri, bind(this.onConnect, this), bind(this.gestErreur, this));
    },

    // Réalise les initialisations nécessaires après la connection.
    onConnect: function (root)
    {
        /* HACK : on ne peut normalement pas récupérer l'identifiant de l'utilisateur
         * avec l'API Google, on en trouve un en récupérant l'identifiant du calendrier
         * primaire de l'utilisateur qui est unique et correspond justement l'adresse
         * mail du compte Google (l'important est surtout son unicité). */
        this.userId = root.feed.getEntries()[0].getId().getValue().replace('%40', '@');
        this.userId = this.userId.substring(this.userId.lastIndexOf('/') + 1, this.userId.length);

        // Crée le repertoire de l'utilisateur à la première connexion
        $.ajax({
            type: "POST",
            url: "inc/createDirectories.php",
            data: "id=" + this.userId
        });

        // Charge les box
        listBox.loadFromXML(this.userId);

        // Charge les post-its
        panel.loadPostits(this.userId);
    },

    getUserId: function ()
    {
        return this.userId;
    },

    isLoggedIn: function ()
    {
        return (google.accounts.user.getStatus(this.scope) == google.accounts.AuthSubStatus.LOGGED_IN);
    },

    getService: function ()
    {
        return this.calendarService;
    },

    // Gestionnaire d'erreur
    gestErreur: function (erreur)
    {
        alert(erreur);
    }
}