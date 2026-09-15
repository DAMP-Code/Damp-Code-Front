import Chart from "react-apexcharts";

const PrizeChart = ({ hackathons }) => {

  const options = {
    chart: {
      type: "bar",
      background: "transparent",
      toolbar: {
        show: false
      }
    },

    colors: ["#C68FE6"],

    title: {
      text: "Premiação por Hackathon",
      align: "center",
      style: {
        color: "#FFFFFF",
        fontSize: "20px",
        fontWeight: 700
      }
    },

    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 8,
        borderRadiusApplication: "end",
        distributed: false
      }
    },

    dataLabels: {
      enabled: true,
      formatter: (val) => `R$ ${val.toLocaleString("pt-BR")}`,
      style: {
        colors: ["#FFFFFF"],
        fontWeight: 600
      }
    },

    xaxis: {
      categories: hackathons.map(
        h => h.titulo
      ),
      labels: {
        style: {
          colors: "#FFFFFF"
        },
        formatter: (value) =>
          `R$ ${Number(value).toLocaleString("pt-BR")}`
      }
    },

    yaxis: {
      labels: {
        style: {
          colors: "#FFFFFF"
        }
      }
    },

    grid: {
      borderColor: "#6C48C5",
      strokeDashArray: 5
    },

    tooltip: {
      theme: "dark",
      y: {
        formatter: (value) =>
          `R$ ${value.toLocaleString("pt-BR")}`
      }
    }
  };

  const series = [
    {
      name: "Premiação",
      data: hackathons.map(
        h => h.premiacao
      )
    }
  ];

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
        type="bar"
        height={400}
      />
    </div>
  );
};

export default PrizeChart;