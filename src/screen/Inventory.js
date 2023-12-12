import { Box, Tab, Tabs } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import SwipeableViews from 'react-swipeable-views-react-18-fix/lib/SwipeableViews';
import CustomTabPanel from '../component/CustomTabPanel';
import { setCurrentTabInventory } from '../reduxjs@toolkit/inventorySlice';
import CardinalInventoryCheck from './inventory/CardinalInventoryCheck';

const style = {
  tabs: {
    borderBottom: '1px solid',
    borderColor: 'divider',
  },
};

const Inventory = () => {
  const dispatch = useDispatch();
  const { currentTab } = useSelector((state) => state.inventory);
  return (
    <Box>
      <Tabs
        sx={style.tabs}
        value={currentTab}
        textColor="primary"
        indicatorColor="primary"
        variant="fullWidth"
        onChange={(e, newValue) => {
          dispatch(setCurrentTabInventory(newValue));
        }}
      >
        <Tab label="CARDINAL INVOICE" />
        <Tab label="FUNCTION 2" />
        <Tab label="FUNCTION 3" />
      </Tabs>
      <SwipeableViews index={currentTab}>
        <CustomTabPanel value={currentTab} index={0}>
          <CardinalInventoryCheck />
        </CustomTabPanel>
        <CustomTabPanel value={currentTab} index={1}>
          FUNCTION 2
        </CustomTabPanel>
        <CustomTabPanel value={currentTab} index={2}>
          FUNCTION 3
        </CustomTabPanel>
      </SwipeableViews>
    </Box>
  );
};

export default Inventory;
