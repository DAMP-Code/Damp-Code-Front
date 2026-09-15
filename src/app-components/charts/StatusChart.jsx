import Chart from "react-apexcharts";

const StatusChart = ({ hackathons }) => {
  const activeCount = hackathons.filter(h => h.status).length;
  const inactiveCount = hackathons.filter(h => !h.status).length;

  hackathons.forEach(h => {
  console.log(h.titulo, h.status, typeof h.status);
});

  const series = [activeCount, inactiveCount];

  const options = {
    chart: {
      background: "transparent",
      toolbar: {
        show: false
      }
    },

    labels: ["Ativos", "Inativos"],

    colors: [
      "#C68FE6", // roxo claro
      "#FFEA00"  // amarelo
    ],

    legend: {
      position: "bottom",
      labels: {
        colors: "#FFFFFF"
      },
      fontSize: "14px"
    },

    dataLabels: {
      enabled: true,
      style: {
        fontSize: "16px",
        fontWeight: "bold"
      }
    },

    stroke: {
      width: 3,
      colors: ["#170A36"]
    },

    plotOptions: {
      pie: {
        expandOnClick: true,
        donut: {
          size: "55%"
        }
      }
    },

    tooltip: {
      theme: "dark"
    },

    title: {
      text: "Status dos Hackathons",
      align: "center",
      style: {
        color: "#FFFFFF",
        fontSize: "20px",
        fontWeight: 700
      }
    }
  };

  return (
    <div
      className="
        bg-[#22114D]
        rounded-2xl
        p-6
        shadow-lg
        border
        border-[#6C48C5]
      "
    >
      <Chart
        options={options}
        series={series}
        type="donut"
        height={350}
      />
    </div>
  );
};

export default StatusChart;