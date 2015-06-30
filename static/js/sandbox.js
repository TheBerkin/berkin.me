window.addEventListener("load", function() {
  var editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    lineNumbers: true,
    mode: "rant"
  });

  editor.on("change", function() {
    resetSaveButton();
  });

  var serverUrl = "http://rant.berkin.me";
  var rbRunning, rbSaving = false;

  function setOutput(value)
  {
    $("#output").text(value);
  }

  function showLinkField(bShow)
  {
    if (bShow)
      $("#savelink").removeClass("hidden");
    else
      $("#savelink").addClass("hidden");
  }

  function resetSaveButton()
  {
    var btn = $("#btnsave");
    btn.text("Save");
    btn.removeClass("error-sandbox");
    btn.removeClass("success-sandbox");
  }

  function createHashLink(hash)
  {
  	var endPoint = window.location.href.indexOf('#');
  	if (endPoint === -1)
  	{
  		endPoint = window.location.href.indexOf('?');
  	}
  	if (endPoint === -1)
  	{
  		endPoint = window.location.href.length;
  	}

  	return window.location.href.slice(0, endPoint) + '#' + (hash[0] == '#' ? hash.substring(1) : hash);
  }

  // If the address has a hash, load the associated pattern
  if (window.location.hash)
  {
    $.ajax({
      url: serverUrl + "/load?pattern=" + window.location.hash.substring(1),
      type: "GET",
      success: function(data) {
        editor.setValue(data);
      },
      async: false
    });
  }

  // Run button
  $("#btnrun").click(function() {
    if (rbRunning) return;
    showLinkField(false);
    resetSaveButton();
    rbRunning = true;
    $.ajax({
      url: serverUrl + "/run",
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
        $("#output").addClass("error-sandbox");
        setOutput(msg);
      },
      complete: function(data, status) {
        rbRunning = false;
      }
    });
  });

  // Save button
  $("#btnsave").click(function() {
    if (rbSaving) return;
    resetSaveButton();
    rbSaving = true;
    $("#btnsave").text("Saving...");
    $.ajax({
      url: serverUrl + "/save",
      type: "POST",
      dataType: "json",
      data: {
        pattern: editor.getValue()
      },
      success: function(data) {
        $("#savelink").val(createHashLink(data.hash));
        $("#btnsave").addClass("success-sandbox");
        showLinkField(true);
        $("#btnsave").text("Saved");
      },
      error: function(data, type, msg) {
        $("#btnsave").addClass("error-sandbox");
        $("#btnsave").text("Save Error");
      },
      complete: function(data, status) {
        rbSaving = false;

      }
    })
  });
});

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
