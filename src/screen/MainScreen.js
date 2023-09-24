import { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';

import CustomTabPanel from '../component/CustomTabPanel';

import PaperBill from './PaperBill';

import HomeIcon from '@mui/icons-material/Home';
import CalculateIcon from '@mui/icons-material/Calculate';
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
    minWidth: '7.5rem',
    maxWidth: '7.5rem',
    height: '100vh',
  },
  screen: {
    ml: '7.5rem',
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
        <Tab icon={<CalculateIcon />} label="Calculator" />
        <Tab icon={<ReceiptLongIcon />} label="Paper Bill" />
        <Tab icon={<AutoStoriesIcon />} label="CII Recon" />
        <Tab icon={<SettingsIcon />} label="Settings" />
      </Tabs>
      <Box sx={style.screen}>
        <CustomTabPanel value={modeValue} index={0}>
          Hello El Camino Pharmacy
        </CustomTabPanel>
        <CustomTabPanel value={modeValue} index={1}>
          MyCalculator
        </CustomTabPanel>
        <CustomTabPanel value={modeValue} index={2}>
          <PaperBill />
        </CustomTabPanel>
        <CustomTabPanel value={modeValue} index={3}>
          CII Recon
        </CustomTabPanel>
        <CustomTabPanel value={modeValue} index={4}>
          Settings
        </CustomTabPanel>
      </Box>
    </Box>
  );
};

export default MainScreen;
