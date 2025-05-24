Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystem,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

function number_format(number, decimals, dec_point, thousands_sep) {
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

document.addEventListener("DOMContentLoaded", function () {
  const stepLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  function getStep(day) {
    return parseInt(localStorage.getItem("step_" + day)) || 0;
  }

  function saveStep(day, value) {
    localStorage.setItem("step_" + day, value);
  }

  function clearAllSteps() {
    stepLabels.forEach(day => localStorage.removeItem("step_" + day));
  }

  function renderStepChart() {
    const data = stepLabels.map(getStep);
    const goal = 8000;
    const colors = data.map(v => v >= goal ? '#4e73df' : '#d1d3e2');

    const ctx = document.getElementById("stepBarChart");
    if (window.stepChart) window.stepChart.destroy();
    window.stepChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: stepLabels,
        datasets: [{
          label: "步數",
          backgroundColor: colors,
          hoverBackgroundColor: "#2e59d9",
          borderColor: "#4e73df",
          data: data,
        }],
      },
      options: {
        maintainAspectRatio: false,
        layout: { padding: { left: 10, right: 25, top: 25, bottom: 0 } },
        scales: {
          xAxes: [{
            gridLines: { display: false, drawBorder: false },
            ticks: { maxTicksLimit: 7 },
            maxBarThickness: 40
          }],
          yAxes: [{
            ticks: {
              min: 0,
              max: 12000,
              stepSize: 2000,
              padding: 10,
              callback: value => value + ' 步'
            },
            gridLines: {
              color: "rgb(234, 236, 244)",
              zeroLineColor: "rgb(234, 236, 244)",
              drawBorder: false,
              borderDash: [2],
              zeroLineBorderDash: [2]
            }
          }]
        },
        legend: { display: false },
        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          titleMarginBottom: 10,
          titleFontColor: '#6e707e',
          titleFontSize: 14,
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          caretPadding: 10,
          callbacks: {
            label: function (tooltipItem) {
              return '步數：' + tooltipItem.yLabel;
            }
          }
        }
      }
    });
  }

  renderStepChart();

  document.getElementById("saveStepBtn").addEventListener("click", function () {
    const day = document.getElementById("stepDaySelect").value;
    const value = parseInt(document.getElementById("stepInput").value);
    if (!isNaN(value) && value >= 0) {
      saveStep(day, value);
      renderStepChart();
      alert(`已儲存 ${day} 的步數：${value} 步`);
    } else {
      alert("請輸入有效的步數！");
    }
  });

  document.getElementById("clearStepBtn").addEventListener("click", function () {
    if (confirm("你確定要清除所有步數紀錄嗎？")) {
      clearAllSteps();
      renderStepChart();
      alert("已清除所有步數！");
    }
  });
});