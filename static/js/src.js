function escapeHTML(string)
{
    var pre = document.createElement('pre');
    var text = document.createTextNode( string );
    pre.appendChild(text);
    return pre.innerHTML;
}

$("code[data-src]").each(function() {
  var elem = $(this);
  $.ajax({
    url: elem.attr("data-src"),
    success: function(data) {
      elem.html(escapeHTML(data));
    },
    async: false
  });
});
