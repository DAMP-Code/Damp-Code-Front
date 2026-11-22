import Chart from "react-apexcharts";
import { barChartHeight, horizontalBarOptions } from "./chartTheme";

// ordem em que as fases acontecem
const phases = ["Rascunho", "Publicado", "Ativo", "Em avaliação", "Encerrado", "Cancelado"];

// Quantos Hackathons da empresa estão em cada fase (só as fases que têm algum).
const StatusChart = ({ hackathons }) => {
  const counts = phases
    .map((phase) => [phase, hackathons.filter((h) => h.fase === phase).length])
    .filter(([, count]) => count > 0);

  const categories = counts.map(([phase]) => phase);
  const values = counts.map(([, count]) => count);

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

export default StatusChart;
