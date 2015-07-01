$(document).ready(function() {

  var addProject = function(project)
  {
    $("<div/>", {
      class: "project"
    })
    .append(
      $("<div/>", {
        class: "project-body"
      })
      .append(
        // Project title
        $("<span/>", {
          class: "project-title"
        }).text(project.name),

        // Project description
        $("<p/>", { class: "smaller" })
        .text(project.description)
      ),

      // Project link
      $("<div/>", {
        class: "project-links"
      })
      .append($("<a/>", {
        href: project.url,
        class: "smaller",
        target: "_blank"
      }).text("Go to project page"))
    ).appendTo("#project-list");
  }

  $.getJSON("static/projects.json", function(json) {
    for(var i = 0; i < json.projects.length; i++)
    {
      addProject(json.projects[i]);
    }
  });
});
