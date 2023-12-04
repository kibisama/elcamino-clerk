import { useState, useEffect, useCallback, Fragment } from 'react';
import debounce from 'lodash/debounce';
import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  TextField,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  asyncSearchDrugs,
  setAutocompleteOptions,
  setDataSelected,
  setIsSearching,
} from '../../reduxjs@toolkit/drugDBSlice';
import OptionBox from './OptionBox';
import DrugDetails from './DrugDetails';
import PriceChart from './PriceChart';

const TestPage = () => {
  const dispatch = useDispatch();

  const [open, setOpen] = useState(false);
  const { autocompleteOptions, dataSelected, isSearching } = useSelector(
    (state) => state.drugDB,
  );
  const [term, setTerm] = useState('');
  const handleSearch = (body) => {
    dispatch(asyncSearchDrugs(body));
  };
  const debouncedAsyncSearchDrugs = useCallback(
    debounce(handleSearch, 500),
    [],
  );

  useEffect(() => {
    if (!open) {
      setTerm('');
    }
  }, [dispatch, open]);

  return (
    <Box>
      <Autocomplete
        sx={{ width: 600 }}
        clearOnEscape
        open={open}
        onChange={(e, newValue) => {
          dispatch(setDataSelected(newValue));
        }}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
          setAutocompleteOptions([]);
        }}
        options={autocompleteOptions}
        getOptionLabel={(option) => option.labelName}
        isOptionEqualToValue={(option, value) => option.ndc === value.ndc}
        renderOption={OptionBox}
        renderInput={(params) => (
          <TextField
            {...params}
            value={term}
            onChange={(e) => {
              setTerm(e.target.value);
              dispatch(setIsSearching(true));
              debouncedAsyncSearchDrugs({ term: e.target.value });
            }}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {isSearching ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </Fragment>
              ),
            }}
          />
        )}
      />
      <Button onClick={() => {}}>TEST BUTTON</Button>
      <DrugDetails data={dataSelected} />
      <PriceChart data={dataSelected} />
    </Box>
  );
};

export default TestPage;
