$.("code[data-src]").each(function() {
  var elem = $(this);
  elem.load(elem.attr("data-src"));
});
