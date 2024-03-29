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

/**
 * Create a new Document object. If no arguments are specified,
 * the document will be empty. If a root tag is specified, the document
 * will contain that single root tag. If the root tag has a namespace
 * prefix, the second argument must specify the URL that identifies the
 * namespace.
 */
function newDocument(rootTagName, namespaceURL)
{
    if (!rootTagName) rootTagName = "";
    if (!namespaceURL) namespaceURL = "";
    if (document.implementation && document.implementation.createDocument) {
        // This is the W3C standard way to do it
        return document.implementation.createDocument(namespaceURL, rootTagName, null);
    }
    else { // This is the IE way to do it
        // Create an empty document as an ActiveX object
        // If there is no root element, this is all we have to do
        var doc = new ActiveXObject("MSXML2.DOMDocument");
        // If there is a root tag, initialize the document
        if (rootTagName) {
            // Look for a namespace prefix
            var prefix = "";
            var tagname = rootTagName;
            var p = rootTagName.indexOf(':');
            if (p != -1) {
                prefix = rootTagName.substring(0, p);
                tagname = rootTagName.substring(p+1);
            }
            // If we have a namespace, we must have a namespace prefix
            // If we don't have a namespace, we discard any prefix
            if (namespaceURL) {
                if (!prefix) prefix = "a0"; // What Firefox uses
            }
            else prefix = "";
            // Create the root element (with optional namespace) as a
            // string of text
            var text = "<" + (prefix ? (prefix+":") : "") + tagname +
                       (namespaceURL ? (" xmlns:" + prefix + '="' + namespaceURL +'"') :"") +
                       "/>";
            // And parse that text into the empty document
            doc.loadXML(text);
        }
        return doc;
    }
}