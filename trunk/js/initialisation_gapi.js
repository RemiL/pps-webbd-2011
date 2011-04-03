google.load("gdata", "2.s");
google.setOnLoadCallback(remplirCalendrierDuJour);

var calendarService, scope;

function connecterCalendar()
{
    calendarService = new google.gdata.calendar.CalendarService("PPS-OneThingAtATime-0.01");
    scope = "https://www.google.com/calendar/feeds/";
    
    if (google.accounts.user.getStatus(scope) == google.accounts.AuthSubStatus.LOGGED_OUT)
        var token = google.accounts.user.login(scope);
}

// Gestionnaire d'erreur
function gestErreur(erreur)
{
    alert(erreur);
}

function getEvenementsDuJour(callback)
{
    connecterCalendar();
    
    if (google.accounts.user.getStatus(scope) == google.accounts.AuthSubStatus.LOGGED_IN)
    {
        // On veut r�cup�rer tous les �v�nements depuis le calendrier par d�faut
        var feedUri = "https://www.google.com/calendar/feeds/default/private/full";
        
        // Pr�paration de la requ�te
        var query = new google.gdata.calendar.CalendarEventQuery(feedUri);
        
        // On souhaite r�cup�rer les �v�nements du jour
        var today_start = new Date();
        today_start.setHours(0);
        today_start.setMinutes(0);
        today_start.setSeconds(0);
        today_start.setMilliseconds(0);
        var startMin = new google.gdata.DateTime(today_start);
        var today_end = new Date();
        today_end.setHours(23);
        today_end.setMinutes(59);
        today_end.setSeconds(59);
        today_end.setMilliseconds(999);
        var startMax = new google.gdata.DateTime(today_end);
        query.setMinimumStartTime(google.gdata.DateTime.toIso8601(startMin));
        query.setMaximumStartTime(google.gdata.DateTime.toIso8601(startMax));
        
        // Envoi de la requ�te
        calendarService.getEventsFeed(query, callback, gestErreur);
    }
}

function getHoraire(date)
{
    var horaire = date.getHours()+'h';
    
    if (date.getHours() < 10)
        horaire = '0'+horaire;
    if (date.getMinutes() < 10)
        horaire = horaire+'0';
        
    return horaire+date.getMinutes();
}

function remplirCalendrier(root)
{
    // Le calendrier sur la page
    var calendrier = document.getElementById("calendar");
    
    // Les entr�es � afficher suppos�es concerner un seul jour.
    var entrees = root.feed.getEntries();

    if (entrees.length > 0)
    {
        // Une t�che dans le calendrier
        var tache;
        // L'horaire de la tache
        var horaire;
        // Le titre de la tache
        var titre;
        
        for (var i = 0; i < entrees.length; i++)
        {
            var entree = entrees[i];
            
            tache = document.createElement('div');
            
            tache.className = "tacheBox ui-corner-all";
            tache.style.position = 'absolute';
            // On calcule le placement � partir du nombre de minutes depuis minuit (1 pixel = 2 minutes)
            tache.style.top = (entree.getTimes()[0].getStartTime().getDate().getHours()*60 + entree.getTimes()[0].getStartTime().getDate().getMinutes()) / 2 + 'px';
            // On calcule la hauteur � partir de la dur�e
            tache.style.height = (entree.getTimes()[0].getEndTime().getDate().getTime() - entree.getTimes()[0].getStartTime().getDate().getTime()) / (60*2*1000) + 'px';
            
            horaire = document.createElement('div');
            horaire.innerHTML = getHoraire(entree.getTimes()[0].getStartTime().getDate())+' - '+getHoraire(entree.getTimes()[0].getEndTime().getDate())+ ' :';
            tache.appendChild(horaire);
            
            titre = document.createElement('div');
            titre.innerHTML = entree.getTitle().getText();
            tache.appendChild(titre);
            
            calendrier.appendChild(tache);
        }
    }
}

function remplirCalendrierDuJour()
{
    getEvenementsDuJour(remplirCalendrier);
}