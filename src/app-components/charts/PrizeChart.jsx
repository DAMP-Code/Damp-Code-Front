import Chart from "react-apexcharts";
import { barChartHeight, horizontalBarOptions } from "./chartTheme";
import { totalPrize } from "@/app-components/utilities/prizes";

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

// Total em dinheiro dos prêmios de cada Hackathon, do maior para o menor.
const PrizeChart = ({ hackathons }) => {
  const rows = hackathons
    .map((h) => [h.titulo, totalPrize(h)])
    .filter(([, value]) => value > 0)
    .sort((a, b) => b[1] - a[1]);

  const categories = rows.map(([title]) => title);
  const values = rows.map(([, value]) => value);

  const options = horizontalBarOptions({
    labels: categories,
    values,
    formatValue: (value) => money.format(value),
  });

  return (
    <Chart
      options={options}
      series={[{ name: "Premiação", data: values }]}
      type="bar"
      height={barChartHeight(values.length)}
    />
  );
};

export default PrizeChart;
