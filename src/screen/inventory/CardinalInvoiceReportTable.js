import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { red } from '@mui/material/colors';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import PriceChart from '../../component/PriceChart';
import DrugDetailsTable from '../../component/DrugDetailsTable';
import { sum } from '../../lib/constant';

//----------------------------Style----------------------------
const style = {
  container: {
    minWidth: 1200,
  },
  tooltip: {
    backgroundColor: 'white',
    color: 'black',
    border: '1px solid gray',
  },
  tableHeader: {
    fontWeight: 'bold',
    lineHeight: '1rem',
    width: 2,
  },
  tableFooter: {
    height: 40,
    fontSize: '0.95rem',
    fontWeight: 'bold',
  },
};
//-------------------------------------------------------------
const ChartToolTip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    ...style.tooltip,
    minWidth: 420,
  },
}));
const DescToolTip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    ...style.tooltip,
    minWidth: 420,
  },
}));

const CardinalInvoiceReportTable = (props) => {
  const { data } = props;
  if (!data) {
    return;
  }
  const { cost, item, omitCode, origQty, orderQty, shipQty } = data;
  const rows = item.map((v, i) => {
    return {
      ...v,
      origQty: origQty[i],
      orderQty: orderQty[i],
      shipQty: shipQty[i],
      omitCode: omitCode[i],
      description: v.labelName || `${v.genericName} ${v.strength}`,
      unitCost: cost[i],
    };
  });
  return (
    <TableContainer sx={{ mt: '0.5rem' }} component={Box}>
      <Table size="small" sx={style.container}>
        <TableHead>
          <TableRow>
            <TableCell sx={style.tableHeader} align="left">
              CIN
            </TableCell>
            <TableCell sx={style.tableHeader} align="right">
              ORIG QTY
            </TableCell>
            <TableCell sx={style.tableHeader} align="right">
              ORDER QTY
            </TableCell>
            <TableCell sx={style.tableHeader} align="right">
              SHIP QTY
            </TableCell>
            <TableCell sx={style.tableHeader} align="right">
              OMIT CODE
            </TableCell>
            <TableCell sx={style.tableHeader} align="right">
              CLASS
            </TableCell>
            <TableCell
              sx={{
                ...style.tableHeader,
                width: 360,
              }}
              align="right"
            >
              DESCRIPTION
            </TableCell>
            <TableCell sx={{ ...style.tableHeader, width: 100 }} align="right">
              UNIT COST
            </TableCell>
            <TableCell sx={{ ...style.tableHeader, width: 100 }} align="right">
              TOTAL COST
            </TableCell>
            <TableCell sx={{ ...style.tableHeader, width: 120 }} align="center">
              NOTES
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row._id}>
              <TableCell
                align="left"
                onClick={() => {
                  window.navigator.clipboard.writeText(row.cin);
                }}
                component="th"
              >
                {row.cin}
              </TableCell>
              <TableCell align="right">{row.origQty}</TableCell>
              <TableCell align="right">{row.orderQty}</TableCell>
              <TableCell
                align="right"
                sx={row.orderQty !== row.shipQty ? { color: red[700] } : null}
              >
                {row.shipQty}
              </TableCell>
              <TableCell align="right">{row.omitCode}</TableCell>
              <TableCell align="center">{row.productType}</TableCell>
              <TableCell align="right">
                <DescToolTip
                  placement="left"
                  title={<DrugDetailsTable data={row} mini />}
                >
                  <div>{row.description}</div>
                </DescToolTip>
              </TableCell>
              <TableCell align="right">{row.unitCost}</TableCell>
              <TableCell align="right">
                <ChartToolTip
                  placement="left"
                  title={<PriceChart data={row} mini />}
                >
                  <div>
                    $
                    {(
                      Number(row.unitCost.replace(/[$,]/g, '')) *
                      Number(row.shipQty)
                    ).toFixed(2)}
                  </div>
                </ChartToolTip>
              </TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell />
            <TableCell sx={style.tableFooter} align="right" colSpan={4}>
              QTY SHIPPED
            </TableCell>
            <TableCell sx={style.tableFooter}>{sum(rows, 'shipQty')}</TableCell>
            <TableCell colSpan={1} />
            <TableCell sx={style.tableFooter}>TOTAL</TableCell>
            <TableCell sx={style.tableFooter}>
              $
              {rows
                .reduce(
                  (a, c, i) =>
                    a +
                    Number(c.shipQty) * Number(c.unitCost.replace(/[$,]/g, '')),
                  0,
                )
                .toFixed(2)}
            </TableCell>
            <TableCell />
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CardinalInvoiceReportTable;
