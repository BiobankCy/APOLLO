import {
  Box,
  Button,
  styled,
  InputBase,
  useTheme,
} from "@mui/material";
import React from "react";
import SendTwoToneIcon from "@mui/icons-material/SendTwoTone";

const MessageInputWrapper = styled(InputBase)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(18)};
    padding: ${theme.spacing(1)};
    width: 100%;
`,
);

const Input = styled("input")({
  display: "none",
});

interface TransferFormProps {

  sendNowTheRequest: () => void;
  setMynotes: (usernotes: string) => void;
  myNotes: string;
  counterOFList: number;
}

function BottomBarContent(props: TransferFormProps) {
  const { myNotes, sendNowTheRequest, setMynotes, counterOFList } = props;
  const theme = useTheme();

  const sendNow = (event: React.MouseEvent<HTMLButtonElement>) => {
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
      <Box>
        <Button
          startIcon={<SendTwoToneIcon />}
          variant="contained"
          onClick={sendNow}
          disabled={counterOFList === 0}
        >
          Proceed Now
        </Button>
      </Box>
    </Box>
  );
}

export default BottomBarContent;
