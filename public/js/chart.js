$(function () {

  window.graphMetric = function (metric) {

    var metricUrl = '/metrics/' + metric;
    metricUrl = metricUrl.substring(0, metricUrl.lastIndexOf('.')) + '/' + metricUrl.substring(metricUrl.lastIndexOf('.') + 1);
    //metricUrl = '/metrics/io.iflux.test.alarm/currentHour';

    var graphId = 'container-' + metric;

    console.log("Graphing metric " + metric);

    $.get(metricUrl, function (metrics) {

      var data = [];
      var now = new Date();

      var dataProperty;
      var lowerBound;
      var upperBound;
      var addData = function() {};
      var refDate;
      
      refDate = new Date(metrics[0].header.startDate);
      if (metrics[0].header.facet === 'yearly') {
        dataProperty = 'monthly';
        lowerBound = Date.UTC(now.getFullYear() - 1, 11, 31, 23, 59, 59);
        upperBound = Date.UTC(now.getFullYear() + 1, 0, 0, 0, 0, 0);
        addData = function () {
          for (var month = 0; month < 12; month++) {
            if (metrics[0] !== undefined && metrics[0].monthly[month] !== undefined) {
              refDate.setMonth(month);
              console.log(">> " + month);
              data.push([refDate, metrics[0].monthly[month].count]);
            }
          }
        };
      } else if (metrics[0].header.facet === 'monthly') {
        dataProperty = 'daily';
        lowerBound = Date.UTC(now.getFullYear(), now.getMonth() - 1, 31, 23, 59, 59);
        upperBound = Date.UTC(now.getFullYear(), now.getMonth() + 1, 0, 0, 0, 0);
        addData = function () {
          for (var day = 1; day < 31; day++) {
            if (metrics[0] !== undefined && metrics[0].daily[day] !== undefined) {
              refDate.setDate(day);
              data.push([refDate, metrics[0].daily[day].count]);
            }
          }
        };
      } else if (metrics[0].header.facet === 'daily') {
        dataProperty = 'hourly';
        lowerBound = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59);
        upperBound = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
      } else if (metrics[0].header.facet === 'hourly') {
        dataProperty = 'minutely';
        lowerBound = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() - 1, 59, 59);
        upperBound = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours() + 1, 0, 0);
      }

      data.push([lowerBound, 0]);
      addData();
      data.push([upperBound, 0]);


      var graphDiv = $(document.getElementById(graphId));
      graphDiv.highcharts({
        chart: {
          type: 'column',
          animation: false
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
          headerFormat: '{series.name}<br>',
          pointFormat: '{point.x:%H:%M} - <b>{point.y} events</b>'
        },

        plotOptions: {
          spline: {
            marker: {
              enabled: true
            }
          }
        },

        series: [{
          animation: false,
          name: metrics[0].header.metric,
          data: data
        }]
      });
    });

  };

});