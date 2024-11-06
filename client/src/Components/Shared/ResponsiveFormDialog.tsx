import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const TypographyH2 = styled(Typography)(
  ({ theme }) => `
    font-size: ${theme.typography.pxToRem(16)};
`,
);

export type DialogType = "Error" | "Info" | "" | "undefined";

export interface MyProps {
  buttonstartIcon?: JSX.Element | undefined;
  dialogTitle: string;
  dialogContent: any;
  openDialog: boolean;
  setOpenDialog: any;
  dialogType: DialogType;
}

export default function ResponsiveFormDialog(props: MyProps) {
  //useEffect(() => {

  //  //  setOpen(props.setopenfromparent);
  //    setdialogType(props.dialogType);
  //}, [props.openDialog])

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xl"));

  const handleDialogClose = () => {
    props.setOpenDialog(false);
  };

  return (
    <React.Fragment>
      <Dialog
        fullScreen={fullScreen}
        open={props.openDialog}
        //onClose={handleDialogClose}
        TransitionComponent={Transition}
        //keepMounted

        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle
          id="responsive-dialog-title"
          sx={{
            backgroundColor:
              props.dialogType === "Error"
                ? theme.colors.error.dark
                : theme.colors.primary.dark,
            color: "white",
          }}
        >
          <Typography variant="h4">
            <Box sx={{ pb: 0 }}>
              <b>IMS - {props.dialogTitle}</b>
            </Box>
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText component={"span"}>
            <TypographyH2
              sx={{ lineHeight: 1.5, pb: 2 }}
              color="text.primary"
              fontWeight="normal"
            >
              {props.dialogContent}
            </TypographyH2>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleDialogClose}>
            <Typography variant="h4">
              <Box sx={{ pb: 0 }}>
                <b>Cancel</b>
              </Box>
            </Typography>
          </Button>

          <Button onClick={handleDialogClose}>
            <Typography variant="h4">
              <Box sx={{ pb: 0 }}>
                <b>Send</b>
              </Box>
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
