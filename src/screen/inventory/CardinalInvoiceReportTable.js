import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import PriceChart from '../../component/PriceChart';

//----------------------------Style----------------------------
const style = {
  container: {
    minWidth: 1200,
  },
};
//-------------------------------------------------------------
const ChartToolTip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: 'white',
    border: '1px solid gray',
    minWidth: 400,
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
      _id: v._id,
      cin: v.cin,
      cardinalHistShipQty: v.cardinalHistShipQty,
      cardinalHistTotalCost: v.cardinalHistTotalCost,
      cardinalHistUnitCost: v.cardinalHistUnitCost,
      cardinalHistInvoiceDate: v.cardinalHistInvoiceDate,
      origQty: origQty[i],
      orderQty: orderQty[i],
      shipQty: shipQty[i],
      omitCode: omitCode[i],
      description: v.labelName || `${v.genericName} ${v.strength}`,
      unitCost: cost[i],
    };
  });

  return (
    <TableContainer component={Box}>
      <Table sx={style.container}>
        <TableHead>
          <TableRow>
            <TableCell align="left">CIN</TableCell>
            <TableCell align="right">ORIG QTY</TableCell>
            <TableCell align="right">ORDER QTY</TableCell>
            <TableCell align="right">SHIP QTY</TableCell>
            <TableCell align="right">OMIT CODE</TableCell>
            <TableCell align="right">DESCRIPTION</TableCell>
            <TableCell align="right">UNIT COST</TableCell>
            <TableCell align="right">TOTAL COST</TableCell>
            <TableCell align="right">NOTES</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row._id}>
              <TableCell component="th">{row.cin}</TableCell>
              <TableCell align="right">{row.origQty}</TableCell>
              <TableCell align="right">{row.orderQty}</TableCell>
              <TableCell align="right">{row.shipQty}</TableCell>
              <TableCell align="right">{row.omitCode}</TableCell>
              <TableCell align="right">{row.description}</TableCell>
              <TableCell align="right">{row.unitCost}</TableCell>
              <TableCell align="right">
                <ChartToolTip
                  placement="left"
                  title={<PriceChart data={row} mini />}
                >
                  $
                  {(
                    Number(row.unitCost.replace(/[$,]/g, '')) *
                    Number(row.shipQty)
                  ).toFixed(2)}
                </ChartToolTip>
              </TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CardinalInvoiceReportTable;
