import {
  Box,
  Button,
  styled,
  InputBase,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from "@mui/material";
import React from "react";
import {
  TransReasonModel,
} from "../../../models/mymodels";

const MessageInputWrapper = styled(InputBase)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(18)};
    padding: ${theme.spacing(1)};
    width: 100%;
`,
);


interface TransferFormProps {
  sendNowTheRequest: () => void;
  setMynotes: (usernotes: string) => void;
  myNotes: string;
  counterOFcountList: number;
  transReasonsList: TransReasonModel[];
  selectedReasonId: number;
  setselectedReasonId: (reasonid: number) => void;
}

function BottomBarContent(props: TransferFormProps) {
  const {
    myNotes,
    sendNowTheRequest,
    setMynotes,
    counterOFcountList,
    transReasonsList,
    selectedReasonId,
    setselectedReasonId,
  } = props;
  const theme = useTheme();

  const sendNow = () => {
    sendNowTheRequest();
  };

  return (
    <Box
      sx={{
        background: theme.colors.alpha.white[50],
        display: "flex",
        alignItems: "center",
        p: 2,
      }}
    >
      <Box flexGrow={1} display="flex" alignItems="center">
        {/*<Avatar*/}
        {/*  sx={{ display: { xs: 'none', sm: 'flex' }, mr: 1 }}*/}
        {/*  alt={user.name}*/}
        {/*  src={user.avatar}*/}
        {/*/>*/}
        <MessageInputWrapper
          autoFocus
          placeholder="Write your notes here..."
          value={myNotes}
          onChange={(e) => setMynotes(e.target.value)}
          fullWidth
        />
      </Box>
      <Box></Box>
      <Box>
        <Stack direction="row" justifyContent="end">
          {/*<Button*/}
          {/*    sx={{ ml: 1 }}*/}
          {/*    variant="contained"*/}
          {/*    onClick={() => handleClickOpenAddCategDialog()}*/}

          {/*    startIcon={<AddTwoToneIcon fontSize="small" />}*/}
          {/*>*/}
          {/*    Add Sub Category*/}
          {/*</Button>*/}

          <FormControl sx={{ mr: 1, minWidth: 120 }}>
            <InputLabel id="reason-label">Reason</InputLabel>
            <Select
              labelId="reason-label"
              label="Reason"
              id="select-reason"
              value={selectedReasonId?.toString() ?? ""}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setselectedReasonId(isNaN(value) ? 0 : value);
              }}
            >
              {transReasonsList.map((reason) => (
                <MenuItem key={reason.id} value={reason.id}>
                  {reason.reasonName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            color="success"
            //  startIcon={<SendTwoToneIcon />}
            variant="contained"
            size="large"
            onClick={sendNow}
            disabled={counterOFcountList === 0}
          >
            Save
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default BottomBarContent;
