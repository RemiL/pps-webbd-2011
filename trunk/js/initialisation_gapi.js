google.load("gdata", "2.s");
google.setOnLoadCallback(function () { loadDay(0); });

var calendarService, scope;

var dayOffset = 0;

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

function getEvenementsDuJour(dayOffset, callback)
{
    connecterCalendar();
    
    if (google.accounts.user.getStatus(scope) == google.accounts.AuthSubStatus.LOGGED_IN)
    {
        // On veut récupérer tous les événements depuis le calendrier par défaut
        var feedUri = "https://www.google.com/calendar/feeds/default/private/full";
        
        // Préparation de la requête
        var query = new google.gdata.calendar.CalendarEventQuery(feedUri);
        
        // On souhaite récupérer les événements du jour
        var day_start = new Date();
        day_start.setDate(day_start.getDate() + dayOffset);
        day_start.setHours(0);
        day_start.setMinutes(0);
        day_start.setSeconds(0);
        day_start.setMilliseconds(0);
        var startMin = new google.gdata.DateTime(day_start);
        var day_end = new Date();
        day_end.setDate(day_end.getDate() + dayOffset);
        day_end.setHours(23);
        day_end.setMinutes(59);
        day_end.setSeconds(59);
        day_end.setMilliseconds(999);
        var startMax = new google.gdata.DateTime(day_end);
        query.setMinimumStartTime(google.gdata.DateTime.toIso8601(startMin));
        query.setMaximumStartTime(google.gdata.DateTime.toIso8601(startMax));
        
        // Envoi de la requête
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
    var calendrier = document.getElementById("calendarAgenda");
    
    // On vide les éventuelles entrées déjà présentes.
    while (calendrier.firstChild)
        calendrier.removeChild(calendrier.firstChild);
    
    // Les entrées à afficher supposées concerner un seul jour.
    var entrees = root.feed.getEntries();

    if (entrees.length > 0)
    {
        // Une tâche dans le calendrier
        var tache;
        // L'horaire de la tache
        var horaire;
        // Le titre de la tache
        var titre;
        
        for (var i = 0; i < entrees.length; i++)
        {
            var entree = entrees[i];
            
            tache = document.createElement('div');
            
            tache.className = "tacheCalendar ui-corner-all";
            // On calcule le placement à partir du nombre de minutes depuis minuit (1 pixel = 2 minutes)
            tache.style.top = (entree.getTimes()[0].getStartTime().getDate().getHours()*60 + entree.getTimes()[0].getStartTime().getDate().getMinutes()) / 2 + 'px';
            // On calcule la hauteur à partir de la durée
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
    
    showNowMarker(dayOffset == 0);
}

function loadDay(step)
{
    dayOffset += step;
    var day = new Date();
    day.setDate(day.getDate() + dayOffset);
    document.getElementById('calendarDay').innerHTML = day.toLocaleDateString();
    getEvenementsDuJour(dayOffset, remplirCalendrier);
}

function showNowMarker(show)
{
    if (show)
    {
        var calendarNowMarker = document.createElement('div');
        calendarNowMarker.id = 'calendarNowMarker';
        document.getElementById("calendarAgenda").appendChild(calendarNowMarker);
        
        updateNowMarker();
        setInterval(updateNowMarker, 30000);
    }
    else
        clearInterval(updateNowMarker, 30000);
}

function updateNowMarker()
{
    var now = new Date();
    
    document.getElementById('calendarNowMarker').style.top = (now.getHours()*60 + now.getMinutes()) / 2 + 'px';
}