$(document).ready(function() {

  var addProject = function(project)
  {
    $("<div/>", {
      class: "project"
    })
    .append(
      $("<span/>", {
        class: "small line"
      }).text(project.name),
      $("<p/>", { class: "smaller" })
      .text(project.description),
      $("<div/>", {
        class: "align-right"
      }).append($("<a/>", {
        href: project.url,
        class: "smaller"
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
