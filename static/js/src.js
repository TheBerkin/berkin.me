function escapeHTML(string)
{
    var pre = document.createElement('pre');
    var text = document.createTextNode( string );
    pre.appendChild(text);
    return pre.innerHTML;
}

$("code[data-src]").each(function() {
  var elem = $(this);
  elem.load(escapeHTML(elem.attr("data-src")));
});
