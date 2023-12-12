import { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';

import CustomTabPanel from '../component/CustomTabPanel';

import DrugDB from './DrugDB';
import Inventory from './Inventory';
import PaperBill from './PaperBill';

import HomeIcon from '@mui/icons-material/Home';
import MedicationIcon from '@mui/icons-material/Medication';
import DiscountIcon from '@mui/icons-material/Discount';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import SettingsIcon from '@mui/icons-material/Settings';

//----------------------------Style----------------------------
const style = {
  container: {
    display: 'flex',
  },
  tabs: {
    position: 'fixed',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRight: 1,
    borderColor: 'divider',
    width: 120,
    height: '100vh',
  },
  screen: {
    // p: '10px',
    position: 'fixed',
    left: 120,
    minWidth: 1160,
    width: 'calc(100% - 120px)',
    height: '100%',
    overflowY: 'scroll',
  },
};
//-------------------------------------------------------------

const MainScreen = () => {
  const [modeValue, setModeValue] = useState(0);

  const handleChange = (event, newValue) => {
    setModeValue(newValue);
  };

  return (
    <Box sx={style.container}>
      <Tabs
        orientation="vertical"
        value={modeValue}
        onChange={handleChange}
        sx={style.tabs}
      >
        <Tab icon={<HomeIcon />} label="Home" />
        <Tab icon={<MedicationIcon />} label="Drug DB" />
        <Tab icon={<DiscountIcon />} label="Inventory" />
        <Tab icon={<ReceiptLongIcon />} label="Paper Bill" />
        <Tab icon={<AutoStoriesIcon />} label="CII Recon" />
        <Tab icon={<SettingsIcon />} label="Settings" />
      </Tabs>
      <Box sx={style.screen}>
        <CustomTabPanel value={modeValue} index={0}>
          Hello El Camino Pharmacy
        </CustomTabPanel>
        <CustomTabPanel value={modeValue} index={1}>
          <DrugDB />
        </CustomTabPanel>
        <CustomTabPanel value={modeValue} index={2}>
          <Inventory />
        </CustomTabPanel>
        <CustomTabPanel value={modeValue} index={3}>
          <PaperBill />
        </CustomTabPanel>
        <CustomTabPanel value={modeValue} index={4}>
          CII Recon
        </CustomTabPanel>
        <CustomTabPanel value={modeValue} index={5}>
          Settings
        </CustomTabPanel>
      </Box>
    </Box>
  );
};

export default MainScreen;
