import { useState, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { sum } from '../../lib/constant';
import RedditTextField from '../../component/RedditTextField';
import AddItemDialog from './AddItemDialog';

import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

//----------------------------Style----------------------------
import { blue } from '@mui/material/colors';

const style = {
  container: {
    width: '816px',
    '@media print': {
      p: 0,
      m: 0,
      overflow: 'hidden',
      height: '100vh',
      '@page': {
        size: 'letter portrait',
      },
    },
  },
  printMargin: {
    m: '1.5rem',
  },
  storeName: {
    fontWeight: 600,
    fontSize: '1.8rem',
    color: 'primary.dark',
  },
  storeInfo: {
    fontWeight: 400,
    fontSize: '0.8rem',
    pl: '1rem',
    color: 'primary.dark',
  },
  billTo: {
    mt: '2.5rem',
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: 'primary.dark',
    color: 'white',
  },
  billingInfo: {
    fontSize: '0.8rem',
    pl: '1rem',
  },
  invoice: {
    fontWeight: 800,
    fontSize: '3rem',
    color: 'primary.dark',
  },
  dateInfo: {
    display: 'flex',
    fontSize: '0.8rem',
    mt: '1.5rem',
  },
  dateInfoHeader: {
    display: 'flex',
    justifyContent: 'flex-end',
    p: '0.12rem',
    mr: '0.5rem',
  },
  dateInfoValue: {
    display: 'flex',
    justifyContent: 'center',
    border: '1px solid grey',
    p: '0.1rem',
    minWidth: 100,
  },
  description: {
    mt: '2.5rem',
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: 'primary.dark',
    color: 'white',
  },
  descriptionHeader: {
    display: 'flex',
    justifyContent: 'center',
  },
  itemList: {
    minHeight: '1.8rem',
    p: 0,
    '&: nth-child(even)': {
      bgcolor: blue[100],
    },
  },
  item: {
    pl: '1rem',
    fontSize: '0.8rem',
  },
  amount: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '0.8rem',
  },
  addCircleIcon: {
    displayPrint: 'none',
    color: 'primary.dark',
    height: '1.8rem',
  },
  commentBox: {
    borderLeft: '1px solid gray',
    borderRight: '1px solid gray',
    borderBottom: '1px solid gray',
    '& .MuiInputBase-root': {
      p: '0.5rem',
    },
    mb: '1.5rem',
  },
  totalBox: {
    p: '1.5rem',
    pr: 0,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  totalHeader: {
    fontWeight: 600,
    mr: '1rem',
  },
  dollar: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
  },
  grandGrandTotal: {
    flex: 4,
    display: 'flex',
    justifyContent: 'flex-end',
    pr: '0.5rem',
    fontWeight: 600,
  },
  grandGrandTotalBox: {
    bgcolor: blue[100],
    minWidth: '7rem',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  payTo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    pr: '0.5rem',
  },
  pleaseContact: {
    fontWeight: 400,
    fontSize: '0.8rem',
  },
  thankyou: {
    mt: '0.2rem',
    fontWeight: 600,
    fontSize: '1rem',
  },
};

//-------------------------------------------------------------

const InvoicePrintPreview = () => {
  const planId = useParams().planId;
  const content = useSelector((state) => state.print.paperBill);
  const billingInfo = content.settings.plans[planId].billingInfo;
  const grandTotal = sum(content.rowsArrays[planId], 'PatPAy').toFixed(2);
  const maxLines = 12;
  const itemListBackground = new Array(maxLines).fill({});
  const firstItem = {};
  if (Number(grandTotal) > 0) {
    Object.assign(firstItem, {
      id: 1,
      description: `Prescriptions for ${content.lastRxDate.monthName} ${
        content.lastRxDate.year
      }${billingInfo.department !== '' ? ` (${billingInfo.department})` : ''}`,
      amount: grandTotal,
    });
  }
  const [itemList, setItemList] = useState([firstItem]);

  const [openAddItemDialog, setOpenAddItemDialog] = useState(false);
  const handleClickAddButton = () => {
    setOpenAddItemDialog(true);
  };
  const handleRemoveButton = (value) => {
    const newItemList = itemList.filter((item) => value !== item.id);
    setItemList(newItemList);
  };
  const handleCloseAddDialog = () => {
    setOpenAddItemDialog(false);
  };
  const itemId = useRef(2);
  const handleAddItem = useCallback(
    (description, amount) => {
      const newItem = {
        id: itemId.current,
        description,
        amount,
      };
      itemId.current += 1;
      const newItemList = itemList.concat(newItem);
      setItemList(newItemList);
    },
    [itemList],
  );

  console.log(itemList);
  const grandGrandTotal = sum(itemList, 'amount').toFixed(2);

  if (!content) {
    return;
  }
  return (
    <Box sx={style.container}>
      <Typography component="span">
        <AddItemDialog
          open={openAddItemDialog}
          handleClose={handleCloseAddDialog}
          handleOK={handleAddItem}
        />
        <Box sx={style.printMargin}>
          <Grid container>
            <Grid xs={5}>
              <Box sx={style.storeName}>{content.settings.storeInfo.name}</Box>
              <Box sx={style.storeInfo}>
                {content.settings.storeInfo.address}
              </Box>
              <Box sx={style.storeInfo}>{content.settings.storeInfo.city}</Box>
              <Box sx={style.storeInfo}>
                Phone: {content.settings.storeInfo.phone}
              </Box>
              <Box sx={style.storeInfo}>
                Fax: {content.settings.storeInfo.fax}
              </Box>
              <Box sx={style.billTo}>
                <Box sx={{ ...style.billingInfo, fontSize: '1rem' }}>
                  BILL TO
                </Box>
              </Box>
              <Box sx={style.billingInfo}>{billingInfo.name}</Box>
              <Box sx={style.billingInfo}>{billingInfo.address}</Box>
              <Box sx={style.billingInfo}>{billingInfo.city}</Box>
              <Box sx={style.billingInfo}>{billingInfo.phone}</Box>
            </Grid>
            <Grid xs={2}></Grid>
            <Grid
              xs={5}
              display="flex"
              flexDirection="column"
              justifyContent="flex-start"
              alignItems="flex-end"
            >
              <Box sx={style.invoice}>INVOICE</Box>
              <Box sx={style.dateInfo}>
                <Box>
                  <Box sx={style.dateInfoHeader}>INVOICE DATE</Box>
                  <Box sx={style.dateInfoHeader}>INVOICE NUMBER</Box>
                  <Box sx={style.dateInfoHeader}>DUE DATE</Box>
                </Box>
                <Box>
                  <Box sx={style.dateInfoValue}>
                    {content.invoiceDate.month}/{content.invoiceDate.date}/
                    {content.invoiceDate.year}
                  </Box>
                  <Box sx={{ ...style.dateInfoValue, borderTop: 'none' }}>
                    {content.invoiceNumArrays[planId]}
                  </Box>
                  <Box sx={{ ...style.dateInfoValue, borderTop: 'none' }}>
                    {content.invoiceDueDate.month}/{content.invoiceDueDate.date}
                    /{content.invoiceDueDate.year}
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid xs={9}>
              <Box sx={style.description}>
                <Box sx={style.descriptionHeader}>DESCRIPTION</Box>
              </Box>
            </Grid>
            <Grid xs={3}>
              <Box sx={style.description}>
                <Box sx={style.descriptionHeader}>AMOUNT</Box>
              </Box>
            </Grid>
            <Grid xs={12}>
              <List disablePadding>
                {itemListBackground.map((item, i) => (
                  <>
                    {itemList.length === i && i < maxLines ? (
                      <ListItem
                        sx={{
                          ...style.itemList,
                          display: 'flex',
                          justifyContent: 'center',
                        }}
                      >
                        <Button
                          sx={style.addCircleIcon}
                          startIcon={<AddCircleIcon />}
                          onClick={handleClickAddButton}
                        >
                          Add an item
                        </Button>
                      </ListItem>
                    ) : (
                      <ListItem sx={style.itemList}>
                        <Grid xs={9}>
                          <Box sx={style.item}>
                            {itemList[i]?.id && itemList[i].description}
                          </Box>
                        </Grid>
                        <Grid xs={3}>
                          <Box sx={style.amount}>
                            {itemList[i]?.id && itemList[i].amount}
                          </Box>
                        </Grid>
                        {itemList[i]?.id && (
                          <Box
                            sx={{
                              position: 'absolute',
                              left: '47.5rem',
                            }}
                          >
                            <IconButton
                              sx={{
                                ...style.addCircleIcon,
                                color: 'error.main',
                              }}
                              onClick={() => {
                                handleRemoveButton(itemList[i].id);
                              }}
                            >
                              <RemoveCircleIcon />
                            </IconButton>
                          </Box>
                        )}
                      </ListItem>
                    )}
                  </>
                ))}
              </List>
            </Grid>
            <Grid xs={6}>
              <Box sx={style.commentBoxWrapper}>
                <Box
                  sx={{
                    ...style.billTo,
                    ...style.billingInfo,
                    fontSize: '0.8rem',
                  }}
                >
                  OTHER COMMENTS
                </Box>
                <Box sx={style.commentBox}>
                  <RedditTextField
                    variant="filled"
                    size="small"
                    fullWidth
                    multiline
                    minRows={5}
                    maxRows={5}
                  ></RedditTextField>
                </Box>
              </Box>
            </Grid>
            <Grid xs={6}>
              <Box sx={style.totalBox}>
                <Box sx={style.totalHeader}>TOTAL</Box>
                <Box sx={style.grandGrandTotalBox}>
                  <Box sx={style.dollar}>$</Box>
                  <Box sx={style.grandGrandTotal}>{grandGrandTotal}</Box>
                </Box>
              </Box>
              <Box sx={style.payTo}>
                <Box sx={{ fontSize: '0.8rem' }}>
                  Make all checks payable to
                </Box>
                <Box sx={{ fontSize: '0.9rem', fontWeight: 600 }}>
                  {content.settings.storeInfo.name}
                </Box>
              </Box>
            </Grid>
            <Grid
              xs={12}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Box sx={style.pleaseContact}>
                If you have any questions concerning this invoice, plase contact
              </Box>
              <Box sx={style.pleaseContact}>
                {content.settings.storeInfo.manager},{' '}
                {content.settings.storeInfo.phone}
              </Box>
              <Box sx={style.thankyou}>Thank You For Your Business!</Box>
            </Grid>
          </Grid>
        </Box>
      </Typography>
    </Box>
  );
};

export default InvoicePrintPreview;
