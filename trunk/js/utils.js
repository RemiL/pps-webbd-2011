/*
Transforme un objet en tableau
*/
function toArray(obj)
{
    return Array.prototype.slice.call(obj);
}

/*
Fonction retournant une fonction liant une m�thode � son contexte (� un objet � priori).
Cette fonction est utile pour pouvoir appeler la m�thode d'un objet � partir de l'objet
lui-m�me en utilisant un setInterval ou un SetTimeout.
*/
function bind(methode,contexte)
{
    var args = new Array();
    for (var i=2; i<arguments.length; i++)
        args.push(arguments[i]);
    return (function(){methode.apply(contexte,args.concat(toArray(arguments)));});
}

/*
Transforme un document XML en chaine de caract�res.
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