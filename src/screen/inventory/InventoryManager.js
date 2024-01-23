import { Box, Button, CircularProgress, Switch, Tooltip } from '@mui/material';
import { useCallback, useState } from 'react';

const InventoryManager = () => {
  const [dataMatrix, setDataMatrix] = useState('');
  const inputDataMatrix = useCallback((e) => {
    if (e.key !== 'Shift') {
      setDataMatrix((prev) => prev + e.key);
    }
  }, []);
  console.log(dataMatrix);
  return (
    <div tabIndex={0} onKeyDown={inputDataMatrix}>
      test
    </div>
  );
};

export default InventoryManager;
