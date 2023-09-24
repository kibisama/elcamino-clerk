import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import {
  GridToolbarContainer,
  GridToolbarQuickFilter,
  GridToolbarColumnsButton,
  useGridApiContext,
} from '@mui/x-data-grid';

import NextPlanIcon from '@mui/icons-material/NextPlan';
import PrintIcon from '@mui/icons-material/Print';

import PlanSelectPopper from './PlanSelectPopper';
import { updateRowsArrays } from '../../reduxjs@toolkit/paperBillSlice';
import { setPaperBill } from '../../reduxjs@toolkit/printSlice';

//----------------------Style & BaseProps----------------------
const style = {};
const buttonBaseProps = {
  size: 'small',
};
//-------------------------------------------------------------
const PaperBillToolbar = () => {
  const {
    dataDisplay: {
      invoiceDate,
      invoiceDueDate,
      lastRxDate,
      invoiceNumArrays,
      currentPlan,
      rowsArrays,
      savedState,
    },
    uploadCSV: { plans },
  } = useSelector((state) => state.paperBill);
  const apiRef = useGridApiContext();
  const selectedRows = apiRef.current.getSelectedRows();

  const dispatch = useDispatch();

  // Transfer
  const [selectedPlan, setSelectedPlan] = useState('');
  const [anchorPlanSelectPopper, setAnchorPlanSelectPopper] = useState(null);
  const boolPlanSelectPopper = Boolean(anchorPlanSelectPopper);
  const openPlanSelectPopper = (event) => {
    setAnchorPlanSelectPopper(
      anchorPlanSelectPopper ? null : event.currentTarget,
    );
  };
  const onClickTransfer = () => {
    const payload = {
      actionType: 'transfer',
      currentPlan: currentPlan,
      transferTo: selectedPlan,
      rowsArrays: rowsArrays,
      selectedRows: selectedRows,
    };
    dispatch(updateRowsArrays(payload));
  };
  const onSelectPlan = (value) => {
    setSelectedPlan(value);
  };
  const onCancelPlanSelectPopper = () => {
    setAnchorPlanSelectPopper(null);
    setSelectedPlan('');
  };
  // Print
  const handlePrintList = () => {
    dispatch(
      setPaperBill({
        rowsArrays,
        invoiceDate,
        invoiceDueDate,
        lastRxDate,
        invoiceNumArrays,
      }),
    );
    window.open(`/print/paperbill/${currentPlan}`, '_blank');
    window.open(`/print/paperbill/invoice/${currentPlan}`, '_blank');
  };

  useEffect(() => {
    if (!selectedRows.size) {
      setAnchorPlanSelectPopper(null);
      setSelectedPlan('');
    }
  }, [selectedRows]);

  return (
    <GridToolbarContainer>
      <PlanSelectPopper
        anchorEl={anchorPlanSelectPopper}
        currentPlan={currentPlan}
        open={boolPlanSelectPopper}
        onClickCancelButton={onCancelPlanSelectPopper}
        onClickTransfer={onClickTransfer}
        onSelectPlan={onSelectPlan}
        plans={plans}
        selectedPlan={selectedPlan}
      />
      <GridToolbarQuickFilter />
      <GridToolbarColumnsButton />
      <Button
        {...buttonBaseProps}
        startIcon={<NextPlanIcon />}
        disabled={!selectedRows.size}
        onClick={(event) => {
          openPlanSelectPopper(event);
        }}
      >
        Transfer
      </Button>
      {currentPlan !== plans.length - 1 && (
        <Button
          {...buttonBaseProps}
          startIcon={<PrintIcon />}
          onClick={handlePrintList}
        >
          Print
        </Button>
      )}
    </GridToolbarContainer>
  );
};

export default PaperBillToolbar;
