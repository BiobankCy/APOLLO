import React from 'react';
import { MobileDateTimePicker, MobileDateTimePickerProps } from "@mui/x-date-pickers";
import { Stack, TextField } from '@mui/material';
import { FilterChangeType, ReportFilterModel, DateRangeType, isDateRangeType } from '../../Models/AllInterfaces';
import { format } from 'date-fns';

interface DateRangeFilterProps {
  filter: ReportFilterModel;
  onChange: FilterChangeType;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ filter, onChange }) => {

 
  const handleDateChange = (dates: Partial<DateRangeType>) => {
    const value = isDateRangeType(filter.value) ? filter.value : { startDate: undefined, endDate: undefined };
  
    onChange(filter.name, {
      ...value,
      ...dates,
    });
  };
  

  const renderInputValue = (date: Date | null | undefined) => {
    return date ? format(date, 'dd/MM/yyyy h:mm:ss a') : '';
  };

  const mobileDateTimePickerPropsStart: MobileDateTimePickerProps<Date, Date> = {
    renderInput: (props) => (
      <TextField
        {...props}
        value={renderInputValue((filter.value as DateRangeType)?.startDate)}
        fullWidth
      />
    ),
    label: 'Start Date',
    inputFormat: 'dd/MM/yyyy h:mm:ss a',
    ampm:false,
    value: isDateRangeType(filter.value) ? (filter.value as DateRangeType)?.startDate ?? null : null,
    onChange: (startDate: Date | null) => handleDateChange({
      startDate: startDate !== null ? startDate : undefined,
    }),
  };

  const mobileDateTimePickerPropsEnd: MobileDateTimePickerProps<Date, Date> = {
    renderInput: (props) => (
      <TextField
        {...props}
        value={renderInputValue((filter.value as DateRangeType)?.endDate )}
        fullWidth
      />
    ),
    label: 'End Date',
    inputFormat: 'dd/MM/yyyy h:mm:ss a',
    ampm:false,
    value: isDateRangeType(filter.value) ? (filter.value as DateRangeType)?.endDate ?? null : null,
    onChange: (endDate: Date | null) => handleDateChange({
      endDate: endDate !== null ? endDate : undefined,
    }),
  };

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      justifyContent="flex-start"
      alignItems="center"
      spacing={2}
    >
      <MobileDateTimePicker {...mobileDateTimePickerPropsStart} />
      <MobileDateTimePicker {...mobileDateTimePickerPropsEnd} />
    </Stack>
  );
};

export default DateRangeFilter;
