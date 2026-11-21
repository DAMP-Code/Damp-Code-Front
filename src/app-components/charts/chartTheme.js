// Opções comuns dos gráficos de barra horizontal: uma série, uma cor, grade discreta e texto nas cores do tema.
// O valor de cada barra vai na segunda linha do rótulo (nome / valor) e não em cima da barra: o ApexCharts
// joga o texto para o começo do eixo quando a barra é mais curta que ele, e a barra pequena ficava ilegível.
export const chartColors = {
  bar: "#C68FE6",
  text: "#e6edf3",
  muted: "#8b949e",
  grid: "rgba(255,255,255,0.08)",
};

// a API manda o texto "3 pessoas já entraram"; o número vem antes do texto
export function participantCount(hackathon) {
  return parseInt(hackathon.participantes, 10) || 0;
}

// altura que cabe todas as barras e os rótulos de duas linhas
export function barChartHeight(count) {
  return Math.max(180, count * 56 + 60);
}

// eixo de contagem (1, 2, 3...) sem marcas quebradas: até 4 vai de um em um, acima disso arredonda para múltiplo de 4
function integerScale(maxValue) {
  const top = Math.max(1, Math.ceil(maxValue || 0));
  if (top <= 4) return { max: top, tickAmount: top };
  return { max: Math.ceil(top / 4) * 4, tickAmount: 4 };
}

// eixo de valores com 4 passos redondos (1; 1,5; 2; 2,5; 3; 4; 5; 6 ou 8 vezes uma potência de 10)
function roundScale(largest) {
  const rawStep = largest / 4;
  if (rawStep <= 0) return { max: 4, tickAmount: 4 };
  const power = 10 ** Math.floor(Math.log10(rawStep));
  const step = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].find((factor) => factor * power >= rawStep) * power;
  return { max: step * 4, tickAmount: 4 };
}

// labels: nome de cada barra; values: valor de cada barra; formatValue: texto do valor com a unidade;
// max fixa o fim do eixo (ex.: nota até 100)
export function horizontalBarOptions({ labels, values, formatValue = (value) => value, integer = false, max }) {
  const largest = Math.max(0, ...values);
  const scale = max ? { max, tickAmount: 4 } : integer ? integerScale(largest) : roundScale(largest);
  // rótulo em duas linhas: nome em cima, valor embaixo
  const categories = labels.map((label, index) => [label, String(formatValue(values[index]))]);

  return {
    chart: {
      type: "bar",
      background: "transparent",
      fontFamily: "'Geist Variable', sans-serif",
      toolbar: {
        show: false
      }
    },

    colors: [chartColors.bar],

    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 4,
        borderRadiusApplication: "end",
        barHeight: "55%"
      }
    },

    dataLabels: {
      enabled: false
    },

    xaxis: {
      categories,
      min: 0,
      ...scale,
      labels: {
        style: {
          colors: chartColors.muted
        },
        formatter: (value) => (integer ? String(Math.round(value)) : formatValue(value))
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
        maxWidth: 200,
        style: {
          colors: chartColors.text,
          fontSize: "13px"
        }
      }
    },

    grid: {
      borderColor: chartColors.grid,
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
      x: {
        // o rótulo é [nome, valor]; na dica basta o nome
        formatter: (value) => (Array.isArray(value) ? value[0] : value)
      },
      y: {
        // o valor já traz a unidade ("2 Hackathons", "R$ 1.000"); o título da série seria repetição
        title: {
          formatter: () => ""
        },
        formatter: (value) => formatValue(value)
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

    legend: {
      show: false
    },

    // no celular os números do eixo se sobrepõem; o valor já está no rótulo de cada barra
    responsive: [
      {
        breakpoint: 640,
        options: {
          xaxis: {
            min: 0,
            ...scale,
            labels: {
              show: false
            }
          },
          yaxis: {
            labels: {
              maxWidth: 120,
              style: {
                colors: chartColors.text,
                fontSize: "12px"
              }
            }
          }
        }
      }
    ]
  };
}
