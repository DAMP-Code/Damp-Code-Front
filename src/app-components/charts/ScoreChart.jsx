import Chart from "react-apexcharts";

// Nota final (0–100) de cada Hackathon com resultado publicado, do mais antigo para o mais recente.
const ScoreChart = ({ results }) => {
  const options = {
    chart: {
      type: "bar",
      background: "transparent",
      fontFamily: "'Geist Variable', sans-serif",
      toolbar: {
        show: false
      }
    },

    colors: ["#C68FE6"],

    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        borderRadiusApplication: "end",
        barHeight: "55%"
      }
    },

    dataLabels: {
      enabled: true,
      textAnchor: "start",
      offsetX: 6,
      style: {
        colors: ["#e6edf3"],
        fontWeight: 600
      }
    },

    xaxis: {
      categories: results.map((result) => result.titulo),
      min: 0,
      max: 100,
      tickAmount: 4,
      labels: {
        style: {
          colors: "#8b949e"
        }
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },

    yaxis: {
      labels: {
        maxWidth: 180,
        style: {
          colors: "#e6edf3",
          fontSize: "13px"
        }
      }
    },

    grid: {
      borderColor: "rgba(255,255,255,0.08)",
      strokeDashArray: 4,
      xaxis: {
        lines: {
          show: true
        }
      },
      yaxis: {
        lines: {
          show: false
        }
      }
    },

    tooltip: {
      theme: "dark",
      y: {
        formatter: (value) => `${value} de 100`
      }
    },

    states: {
      hover: {
        filter: {
          type: "lighten",
          value: 0.08
        }
      }
    },

    responsive: [
      {
        breakpoint: 640,
        options: {
          yaxis: {
            labels: {
              maxWidth: 110,
              style: {
                colors: "#e6edf3",
                fontSize: "12px"
              }
            }
          }
        }
      }
    ]
  };

  const series = [
    {
      name: "Nota",
      data: results.map((result) => result.nota)
    }
  ];

  return (
    <Chart
      options={options}
      series={series}
      type="bar"
      height={Math.max(160, results.length * 56 + 60)}
    />
  );
};

export default ScoreChart;
