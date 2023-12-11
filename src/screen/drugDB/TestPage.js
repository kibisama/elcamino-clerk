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
import PriceChart from '../../component/PriceChart';

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
  // getOptionLabel props에 함수가 필요하므로 검색어를 프론트부터 타입별로 변환한다
  const getTermType = useCallback((term) => {
    term = term.replace(/\W\s/gi, '');
    let body = {};
    // TODO: 정규표현식 최적화
    switch (true) {
      case /\d{12}/.test(term):
        body.upc = term;
        break;
      case /\d{8,11}/.test(term):
        body.ndc = term;
        break;
      case /\d{7}/.test(term):
        body.cin = term;
        break;
      case /^\d{1,6}/.test(term):
        body.ndc = term;
        break;
      default:
        body.labelName = term;
    }
    return body;
  }, []);

  useEffect(() => {
    if (!open) {
      setTerm('');
    }
  }, [dispatch, open]);

  return (
    <Box>
      <Autocomplete
        sx={{ width: 600 }}
        inputValue={term}
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
        getOptionLabel={(option) => option[Object.keys(getTermType(term))[0]]}
        isOptionEqualToValue={(option, value) => option.upc === value.upc}
        renderOption={OptionBox}
        renderInput={(params) => (
          <TextField
            {...params}
            value={term}
            onChange={(e) => {
              setTerm(e.target.value);
              dispatch(setIsSearching(true));
              debouncedAsyncSearchDrugs(getTermType(e.target.value));
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
            onKeyDown={(e) => {
              if (e.code === 'Enter' && autocompleteOptions[0]) {
                dispatch(setDataSelected(autocompleteOptions[0]));
                setTerm('');
                setOpen(false);
              }
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
