// Set default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

// 自訂格式化函數（模仿 SB Admin 2 的格式用）
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

// 📌 等整個頁面載入後再執行 chart 渲染
document.addEventListener("DOMContentLoaded", function () {
  // 步數資料
  const stepLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const stepData = [6000, 8000, 7500, 4000, 10000, 9000, 3000];
  const goal = 8000;
  const barColors = stepData.map(v => v >= goal ? '#4e73df' : '#d1d3e2');

  // 畫出直條圖
  const ctx = document.getElementById("stepBarChart");
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: stepLabels,
      datasets: [{
        label: "步數",
        backgroundColor: barColors,
        hoverBackgroundColor: "#2e59d9",
        borderColor: "#4e73df",
        data: stepData,
      }],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 25,
          top: 25,
          bottom: 0
        }
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            maxTicksLimit: 7
          },
          maxBarThickness: 40
        }],
        yAxes: [{
          ticks: {
            min: 0,
            max: 12000,
            maxTicksLimit: 6,
            padding: 10,
            callback: function (value) {
              return number_format(value) + ' 步';
            }
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
      legend: {
        display: false
      },
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
          label: function (tooltipItem, chart) {
            return '步數：' + number_format(tooltipItem.yLabel);
          }
        }
      }
    }
  }); // ← 關閉 Chart() 的呼叫
});   // ← 關閉 DOMContentLoaded 的事件