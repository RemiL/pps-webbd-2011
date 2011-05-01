/*
Transforme un objet en tableau
*/
function toArray(obj)
{
    return Array.prototype.slice.call(obj);
}

/*
Fonction retournant une fonction liant une méthode à son contexte (à un objet à priori).
Cette fonction est utile pour pouvoir appeler la méthode d'un objet à partir de l'objet
lui-même en utilisant un setInterval ou un SetTimeout.
*/
function bind(methode,contexte)
{
    var args = new Array();
    for (var i=2; i<arguments.length; i++)
        args.push(arguments[i]);
    return (function(){methode.apply(contexte,args.concat(toArray(arguments)));});
}

/*
Transforme un document XML en chaine de caractères.
*/
function xmlToString(xmlNode)
{
    try
    {
        // Gecko- and Webkit-based browsers (Firefox, Chrome), Opera.
        return (new XMLSerializer()).serializeToString(xmlNode);
    }
    catch (e)
    {
        try
        {
            // Internet Explorer.
            return xmlNode.xml;
        }
        catch (e)
        {  
            //Other browsers without XML Serializer
            alert('Xmlserializer not supported');
        }
    }
    
    return false;
}