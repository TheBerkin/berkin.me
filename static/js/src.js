$("code[data-src]").each(function() {
  var elem = $(this);
  $.ajax({
    url: elem.attr("data-src"),
    success: function(data) {
      var pre = document.createElement('pre');
      var text = document.createTextNode( string );
      pre.appendChild(text);
      elem.html(pre.innerHTML);
    },
    async: false
  });
});
