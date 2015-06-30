window.addEventListener("load", function() {
  var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    lineNumbers: true,
    mode: "rant"
  });

  function setOutput(value)
  {
    $("#output").text(value);
  }

  $("#btnrun").click(function() {
    if (rantboxBusy) return;
    rantboxBusy = true;
    $.ajax({
      url: "http://rant.berkin.me/run",
      type: "POST",
      dataType: "json",
      data: {
        pattern: editor.getValue(),
        includeHidden: $("input#nsfw").attr("checked") ? "nsfw" : ""
      },
      success: function(data) {
        if (data.statusType == "success")
        {
          setOutput(data.output != null ? data.output.main : "");
          $("#output").removeClass("error-sandbox");
        }
        else
        {
          $("#output").addClass("error-sandbox");
          setOutput(data.statusMessage);
        }
      },
      error: function(data, type, msg) {

        setOutput(msg);
      },
      complete: function(xhr, status) {
        rantboxBusy = false;
      }
    });
  });
});

var rantboxBusy = false;

CodeMirror.defineSimpleMode("rant", {
    start: [
      // Comment
      {regex: /#.*/, token: "comment"},
      // Escape
      {regex: /\\(?:\d+,)?(?:[^u\s\r\n]|u[0-9a-f]{4})/, token: "string-2"	},
      // Constant literal
      {regex: /("(?:(?:[^"]|"")*)?")/, token: "string"},
      // Query
      {regex: /<[\s\S]+?>/g, token: "tag"},
      // Regex
      {regex: /`(?:.*?[^\\])?`i?/ig, token: "string-2"},
      // Function
      {
        regex: new RegExp("(\\[)(\\$\\w+|" + rantFunctions + ")[:\\]]", "i"),
        token: [null, "atom"]
      },
      // Subroutine definition
      {regex: /(\[)(\$\??)(\[.*?\])(?=\s*\:)/g, token: [null, "def", "def", "def"]}
    ]
});
