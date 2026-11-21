import Chart from "react-apexcharts";
import { barChartHeight, horizontalBarOptions, participantCount } from "./chartTheme";

// Inscritos em cada Hackathon publicado, do mais procurado para o menos procurado.
const ParticipantsChart = ({ hackathons }) => {
  const rows = hackathons
    .filter((h) => h.fase !== "Rascunho")
    .map((h) => [h.titulo, participantCount(h)])
    .sort((a, b) => b[1] - a[1]);

  const categories = rows.map(([title]) => title);
  const values = rows.map(([, count]) => count);

  const options = horizontalBarOptions({
    labels: categories,
    values,
    formatValue: (value) => `${value} inscrito${value === 1 ? "" : "s"}`,
    integer: true,
  });

  return (
    <Chart
      options={options}
      series={[{ name: "Inscritos", data: values }]}
      type="bar"
      height={barChartHeight(values.length)}
    />
  );
};

export default ParticipantsChart;
