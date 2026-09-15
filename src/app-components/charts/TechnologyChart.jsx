import Chart from "react-apexcharts";

const TechnologyChart = ({ hackathons }) => {

  const counts = {};

  hackathons.forEach(h => {

    h.tecnologias?.forEach(technology => {

      counts[technology] =
        (counts[technology] || 0) + 1;

    });

  });

  const sortedTechnologies = Object.entries(counts)
    .sort((a, b) => b[1] - a[1]);

  const categories = sortedTechnologies.map(
    ([technology]) => technology
  );

  const values = sortedTechnologies.map(
    ([, count]) => count
  );

  const options = {
    chart: {
      type: "bar",
      background: "transparent",
      toolbar: {
        show: false
      }
    },

    title: {
      text: "Tecnologias Mais Utilizadas",
      align: "center",
      style: {
        color: "#FFFFFF",
        fontSize: "20px",
        fontWeight: 700
      }
    },

    colors: ["#FFEA00"],

    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 8,
        borderRadiusApplication: "end"
      }
    },

    dataLabels: {
      enabled: true,
      style: {
        colors: ["#170A36"],
        fontWeight: 700
      }
    },

    xaxis: {
      categories: categories,
      labels: {
        style: {
          colors: "#FFFFFF"
        }
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
      theme: "dark"
    },

    legend: {
      show: false
    }
  };

  const series = [
    {
      name: "Utilizações",
      data: values
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

export default TechnologyChart;