import Chart from "react-apexcharts";
import { barChartHeight, horizontalBarOptions } from "./chartTheme";

// Nota final (0–100) de cada Hackathon com resultado publicado.
const ScoreChart = ({ results }) => {
  const values = results.map((result) => result.nota);

  const options = horizontalBarOptions({
    labels: results.map((result) => result.titulo),
    values,
    formatValue: (value) => `nota ${value}`,
    integer: true,
    max: 100,
  });

  return (
    <Chart
      options={options}
      series={[{ name: "Nota", data: values }]}
      type="bar"
      height={barChartHeight(values.length)}
    />
  );
};

export default ScoreChart;
