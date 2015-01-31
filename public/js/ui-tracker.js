$(function () {
  $("html").mousemove(function (event) {
    $.ajax({
      type: "POST",
      url: "https://iflux.herokuapp.com/events",
      dataType : "json",
      contentType: 'application/json',
      data: JSON.stringify({
        source: "ui",
        type: "io.iflux.event.mousemove",
        timestamp: new Date(),
        properties: {
          x: event.pageX,
          y: event.pageY
        }
      })
    });

  });
});