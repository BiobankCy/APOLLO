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

export default function ResponsiveConfirmationDialog(props: {
  buttontxt: string;
  buttonColor:
  | "primary"
  | "inherit"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning"
  | undefined;
  buttonstartIcon?: JSX.Element | undefined;
  dialogTitle: string;
  dialogContent: any;
  okbtnOnClick: any;
  okbtnText: string;
}) {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [isFormValidationSucceeded, setisFormValidationSucceeded] =
    React.useState(false);
  const [buttonColor, setbuttonColor] = React.useState<
    | "primary"
    | "inherit"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning"
    | undefined
  >(props.buttonColor);

  const handleClickOpen = () => {
    let ff: boolean = props.okbtnOnClick();
    if (ff == undefined) {
    } else {
      setisFormValidationSucceeded(ff);
    }

    if (isFormValidationSucceeded === false) {
      //dont open the Dialog

      setbuttonColor("error");
    } else {
      setbuttonColor(props.buttonColor);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        sx={{ mt: { xs: 2, md: 0 } }}
        startIcon={props.buttonstartIcon ?? undefined}
        color={buttonColor}
        variant="contained"
        onClick={handleClickOpen}
      >
        {props.buttontxt}
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        TransitionComponent={Transition}
        //keepMounted
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle
          id="responsive-dialog-title"
          sx={{ backgroundColor: theme.colors.primary.dark, color: "white" }}
        >
          <Typography variant="h4">
            <Box sx={{ pb: 0 }}>
              <b>IMS - {props.dialogTitle}</b>
            </Box>
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText component={"span"}>
            {/*<Typography component="span" variant="subtitle2">*/}
            {/*    {props.dialogContent}*/}
            {/*</Typography>*/}
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
          <Button autoFocus onClick={handleClose}>
            <Typography variant="h4">
              <Box sx={{ pb: 0 }}>
                <b>Cancel</b>
              </Box>
            </Typography>
          </Button>
          <Button onClick={props.okbtnOnClick} autoFocus>
            <Typography variant="h4">
              <Box sx={{ pb: 0 }}>
                <b>{props.okbtnText}</b>
              </Box>
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
