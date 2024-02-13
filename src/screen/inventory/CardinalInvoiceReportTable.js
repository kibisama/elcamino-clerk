import {
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { red, green } from '@mui/material/colors';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';
import CheckIcon from '@mui/icons-material/Check';
import PriceChart from '../../component/PriceChart';
import PriceComparison from '../../component/PriceComparison';
import DrugDetailsTable from '../../component/DrugDetailsTable';
import { sum } from '../../lib/constant';
import { asyncManageCSOSOrders } from '../../reduxjs@toolkit/inventorySlice';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { useCallback } from 'react';

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
  csosReportBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
  },
  csosReportButton: {
    minWidth: 140,
    minHeight: 37,
  },
  reportedIcon: {
    color: green[700],
  },
  descRed: {
    color: red[700],
  },
  descGreen: {
    color: green[800],
  },
};

//-------------------------------------------------------------
const ChartToolTip = styled(({ className, ...props }) => (
  <Tooltip
    {...props}
    PopperProps={{
      disablePortal: true,
      popperOptions: {
        positionFixed: true,
        modifiers: {
          preventOverflow: {
            enabled: true,
            boundariesElement: 'window',
          },
        },
      },
    }}
    classes={{ popper: className }}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    ...style.tooltip,
    minWidth: 420,
  },
}));
const DescToolTip = styled(({ className, ...props }) => (
  <Tooltip
    {...props}
    PopperProps={{
      disablePortal: true,
      popperOptions: {
        positionFixed: true,
        modifiers: {
          preventOverflow: {
            enabled: true,
            boundariesElement: 'window',
          },
        },
      },
    }}
    classes={{ popper: className }}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    ...style.tooltip,
    minWidth: 420,
  },
}));
const PriceToolTip = styled(({ className, ...props }) => (
  <Tooltip
    {...props}
    PopperProps={{
      disablePortal: true,
      popperOptions: {
        positionFixed: true,
        modifiers: {
          preventOverflow: {
            enabled: true,
            boundariesElement: 'window',
          },
        },
      },
    }}
    classes={{ popper: className }}
  />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    ...style.tooltip,
    minWidth: 800,
  },
}));

const CardinalInvoiceReportTable = (props) => {
  const { data } = props;
  const dispatch = useDispatch();
  const { isPuppeteering } = useSelector((state) => state.inventory);
  // Price Data
  const compareCostAndHist = useCallback((row) => {
    let lastPurchaseIndex = 0;
    if (row.cardinalHistInvoiceDate.length > 0) {
      for (let i = 0; i < row.cardinalHistInvoiceDate.length; i++) {
        if (dayjs(row.cardinalHistInvoiceDate[i]).isBefore(invoiceDate)) {
          lastPurchaseIndex = i;
          break;
        }
      }
    }
    const unitCost = Number(row.unitCost.replace(/[$,]/g, ''));
    const lastCost = Number(
      row.cardinalHistUnitCost[lastPurchaseIndex]?.replace(/[$,]/g, ''),
    );
    switch (true) {
      case unitCost > lastCost:
        return style.descRed;
      case unitCost < lastCost && unitCost !== 0:
        return style.descGreen;
      default:
        return null;
    }
  });

  //Price Data
  const calculatePriceData = useCallback((row) => {
    const lastOrderedBySF =
      row.cardinalHistOrderDate[row.cardinalHistOrderMethod.indexOf('SFDC')];
    const numberCardinalHistUnitCost = row.cardinalHistUnitCost.map((cost) =>
      Number(cost.replace(/[$,]/g, '')),
    );
    const minCardinalHistUnitCost = Math.min(...numberCardinalHistUnitCost);
    const minCardinalUnitCost =
      row.cardinalHistUnitCost[
        numberCardinalHistUnitCost.indexOf(minCardinalHistUnitCost)
      ];
    const totlaSize = Number(row.packageQty) * Number(row.packageSize);
    const ppu = Number(row.unitCost.replace(/[$,]/g, '') / totlaSize).toFixed(
      2,
    );

    const styleDate = (a, b) => {
      if (a?.isAfter(dayjs(b))) {
        return style.descRed;
      }
    };
    const styleCost = (a, b) => {
      if (
        !!b &&
        Number(a?.replace(/[$,]/g, '')) > Number(b?.replace(/[$,]/g, ''))
      ) {
        return style.descGreen;
      }
    };
    return {
      lastOrderedBySF,
      styleLastOrderedBySF: styleDate(_60daysBeforeDate, lastOrderedBySF),
      minCardinalUnitCost,
      ppu,
      unit: row.unit,
      dateLastUpdatedSmartSource: row.dateLastUpdatedSmartSource,
      styleDateLastUpdatedSmartSource: styleDate(
        _60daysBeforeDate,
        row.dateLastUpdatedSmartSource,
      ),
      smartSourceCost: row.smartSourceCost,
      styleSmartSourceCost: styleCost(row.unitCost, row.smartSourceCost),
      smartSourceAltBACCost: row.smartSourceAltBACCost,
    };
  }, []);
  if (!data) {
    return;
  }
  const {
    cost,
    item,
    omitCode,
    origQty,
    orderQty,
    shipQty,
    orderDate,
    poNumber,
    isCSOSReported,
  } = data;
  const now = dayjs();
  const _60daysBeforeDate = now.subtract(60, 'day');
  const invoiceDate = dayjs(data.invoiceDate);
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
  const totalItemsShipped = sum(rows, 'shipQty');

  console.log(data);
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
            <TableCell sx={{ ...style.tableHeader, width: 160 }} align="center">
              NOTES
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow
              key={i}
              onClick={() => {
                window.navigator.clipboard.writeText(row.ndc);
              }}
            >
              <TableCell align="left" component="th">
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
                  placement="right"
                  title={<DrugDetailsTable data={row} mini />}
                >
                  <div>{row.description}</div>
                </DescToolTip>
              </TableCell>
              <TableCell align="right" sx={compareCostAndHist(row)}>
                <PriceToolTip
                  placement="left"
                  title={<PriceComparison data={calculatePriceData(row)} />}
                >
                  <div>{row.unitCost}</div>
                </PriceToolTip>
              </TableCell>
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
            <TableCell sx={style.tableFooter} align="right" colSpan={3}>
              QTY SHIPPED
            </TableCell>
            <TableCell colSpan={4} sx={style.tableFooter}>
              {totalItemsShipped}
            </TableCell>
            <TableCell sx={style.tableFooter}>TOTAL</TableCell>
            <TableCell sx={style.tableFooter}>
              $
              {rows
                .reduce(
                  (a, c) =>
                    a +
                    Number(c.shipQty) * Number(c.unitCost.replace(/[$,]/g, '')),
                  0,
                )
                .toFixed(2)}
            </TableCell>
            <TableCell>
              {poNumber &&
                (!isCSOSReported ? (
                  <Box sx={style.csosReportBox}>
                    <Tooltip title="If you received different items or quantities, please report manually via Cardinal website.">
                      <Button
                        sx={style.csosReportButton}
                        color="secondary"
                        variant="contained"
                        disableElevation
                        disabled={!totalItemsShipped > 0 || isPuppeteering}
                        onClick={() => {
                          dispatch(
                            asyncManageCSOSOrders({
                              poNumber,
                              poDate: orderDate,
                              shipDate: data.invoiceDate,
                              item: rows
                                .filter((v) => Number(v.shipQty) > 0)
                                .map((v) => {
                                  return {
                                    cin: v.cin,
                                    date: data.invoiceDate,
                                    qty: v.shipQty,
                                  };
                                }),
                            }),
                          );
                        }}
                      >
                        {isPuppeteering ? (
                          <CircularProgress size="1.4rem" color="inherit" />
                        ) : (
                          <span>CSOS REPORT</span>
                        )}
                      </Button>
                    </Tooltip>
                  </Box>
                ) : (
                  <Box sx={style.csosReportBox}>
                    <CheckIcon color="success" />
                    REPORTED
                  </Box>
                ))}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CardinalInvoiceReportTable;
