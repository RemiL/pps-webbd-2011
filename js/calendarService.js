/*
Surcouche pour l'objet de l'API Google du même nom.
*/
function CalendarService(autoconnect)
{
    // Objet de l'API Google
    this.calendarService = null;
    this.scope = 'https://www.google.com/calendar/feeds/';
    this.appName = 'PPS-OneThingAtATime-0.01';
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
            this.calendarService.getOwnCalendarsFeed(this.feedUri, bind(this.setUserId, this), bind(this.gestErreur, this));
    },

    setUserId: function (root)
    {
        this.userId = root.feed.getEntries()[0].getId().getValue().replace('%40', '@');
        this.userId = this.userId.substring(this.userId.lastIndexOf('/') + 1, this.userId.length);

        // Cree le repertoire de l'utilisateur à la première connexion
        $.ajax({
            type: "POST",
            url: "inc/createDirectories.php",
            data: "id=" + this.userId
        });

        // Charge les post-it
        $.ajax({
            type: "GET",
            url: "data/" + this.userId + "/postIts.xml",
            dataType: "xml",
            cache: false,
            complete: function (data, status)
            {
                var products = data.responseXML;
                $(products).find('postIt').each(function ()
                {
                    var text = $(this).find('content').text();
                    var x = $(this).find('position').find('x').text();
                    var y = $(this).find('position').find('y').text();
                    panel.loadPostit(text, x, y);
                });
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                alert("An error has occured");
            }
        });
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