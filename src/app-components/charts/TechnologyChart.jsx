import Chart from "react-apexcharts";
import { barChartHeight, horizontalBarOptions } from "./chartTheme";

// Em quantos Hackathons cada tecnologia aparece, da mais usada para a menos usada.
const TechnologyChart = ({ hackathons }) => {
  const counts = {};

  hackathons.forEach((h) => {
    h.tecnologias?.forEach((technology) => {
      counts[technology] = (counts[technology] || 0) + 1;
    });
  });

  const rows = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const categories = rows.map(([technology]) => technology);
  const values = rows.map(([, count]) => count);

  const options = horizontalBarOptions({
    labels: categories,
    values,
    formatValue: (value) => `${value} Hackathon${value === 1 ? "" : "s"}`,
    integer: true,
  });

  return (
    <Chart
      options={options}
      series={[{ name: "Hackathons", data: values }]}
      type="bar"
      height={barChartHeight(values.length)}
    />
  );
};

export default TechnologyChart;
