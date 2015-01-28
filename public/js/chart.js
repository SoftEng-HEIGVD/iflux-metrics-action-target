$(function () {

  $.get('/metrics/io.iflux.test.errors', function (metrics) {

    var values = [];
    var data = [];
    var second = 0;
    /*
    for (var minute = 0; minute < 60; minute++) {
      for (var second = 0; second < 60; second++) {
        if (metrics[0].secondly[minute] === undefined || metrics[0].secondly[minute][second] === undefined) {
          //data.push(Date.UTC(1972, 4, 29, minute, second), 0);
        } else {
          data.push([Date.UTC(1972, 4, 29, minute, second), metrics[0].secondly[minute][second].count]);
        }
      }
    }
    */
    var now = new Date();
    console.log(now);
    console.log(now.getFullYear());
    console.log(now.getMonth()+1);
    console.log(now.getDate());
    data.push([Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 0, 0), 0]);
    data.push([Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), 59, 59), 0]);
    for (var minute = 0; minute < 60; minute++) {
      if (metrics[0].minutely[minute] === undefined) {
        //data.push(Date.UTC(1972, 4, 29, minute, second), 0);
      } else {
        data.push([Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), minute, second), metrics[0].minutely[minute].count]);
      }
    }

    console.log(data);

    $('#container').highcharts({
      chart: {
        type: 'column'
      },
      title: {
        text: 'Metrics'
      },
      subtitle: {
        text: 'Sent via iFLUX actions'
      },
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: { // don't display the dummy year
          month: '%e. %b',
          year: '%b'
        },
        title: {
          text: 'Date'
        }
      },
      yAxis: {
        title: {
          text: 'Value'
        },
        min: 0
      },
      tooltip: {
        headerFormat: '<b>{series.name}</b><br>',
        pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
      },

      plotOptions: {
        spline: {
          marker: {
            enabled: true
          }
        }
      },

      series: [{
        name: metrics[0].header.metric,
        data: data
        }]
    });
  });
});