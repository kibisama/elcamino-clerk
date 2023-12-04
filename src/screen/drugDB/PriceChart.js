import {
  BarPlot,
  ChartContainer,
  ChartsXAxis,
  ChartsYAxis,
  LinePlot,
  MarkPlot,
} from '@mui/x-charts';
import dayjs from 'dayjs';
import { getMonthName } from '../../lib/constant';

const PriceChart = (props) => {
  if (!props.data) {
    return;
  }
  const {
    data: {
      cardinalHistShipQty,
      cardinalHistTotalCost,
      cardinalHistUnitCost,
      cardinalHistInvoiceDate,
    },
  } = props;
  const now = dayjs();
  const range = 13;
  const dayjsOneYear = [now.subtract(1, 'y')];
  for (let i = 1; i < range; i++) {
    dayjsOneYear[i] = dayjsOneYear[i - 1].add(1, 'M');
  }
  const xAxis = dayjsOneYear.map(
    (v) => `${getMonthName(v.month())} ${v.year()}`,
  );
  const validLength = cardinalHistUnitCost.length;
  const yAxisIndex = new Array(validLength);
  for (let i = 0; i < validLength; i++) {
    const dayjsInvoiceDate = dayjs(cardinalHistInvoiceDate[i]);
    if (dayjsInvoiceDate.isBefore(dayjsOneYear[0], 'month')) {
      break;
    }
    for (let j = 0; j < range; j++) {
      if (dayjsInvoiceDate.isSame(dayjsOneYear[j], 'month')) {
        yAxisIndex[i] = j;
      }
    }
  }
  const yAxisQty = new Array(range).fill(0);
  for (let i = 0; i < validLength; i++) {
    yAxisQty[yAxisIndex[i]] += Number(cardinalHistShipQty[i]);
  }
  const yAxisTotalCost = new Array(range).fill(null);
  for (let i = 0; i < validLength; i++) {
    if (yAxisTotalCost[yAxisIndex[i]] === null) {
      yAxisTotalCost[yAxisIndex[i]] = Number(
        cardinalHistTotalCost[i].replace(/[$,]/g, ''),
      );
    } else {
      yAxisTotalCost[yAxisIndex[i]] += Number(
        cardinalHistTotalCost[i].replace(/[$,]/g, ''),
      );
    }
  }
  const yAxisAvgCost = yAxisTotalCost.map((v, i) => {
    if (v !== null) {
      return Number(v / yAxisQty[i]).toFixed(2);
    } else {
      return null;
    }
  });
  const avgCostNumber = yAxisAvgCost.filter((v) => !!v);
  const minCost = Math.min(...avgCostNumber);
  const maxCost = Math.max(...avgCostNumber);

  const series = [
    {
      type: 'bar',
      stack: '',
      yAxisKey: 'qty',
      data: yAxisQty,
    },
    {
      type: 'line',
      yAxisKey: 'avgCost',
      data: yAxisAvgCost,
      connectNulls: true,
      color: 'red',
    },
  ];
  return (
    <ChartContainer
      series={series}
      width={1000}
      height={400}
      xAxis={[
        {
          id: 'interval',
          data: xAxis,
          scaleType: 'band',
        },
      ]}
      yAxis={[
        { id: 'qty', scaleType: 'linear', tickMinStep: 1 },
        {
          id: 'avgCost',
          scaleType: 'linear',
          min: minCost * 0.95,
          max: maxCost * 1.05,
        },
      ]}
    >
      <BarPlot />
      <LinePlot />
      <MarkPlot />
      <ChartsXAxis position="bottom" axisId="interval" />
      <ChartsYAxis label="Order Qty" position="left" axisId="qty" />
      <ChartsYAxis label="Average Cost" position="right" axisId="avgCost" />
    </ChartContainer>
  );
};

export default PriceChart;
