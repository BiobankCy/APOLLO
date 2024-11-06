import React from "react";
import { useState, useRef, FC, useEffect } from "react";
import { useAuth } from "src/contexts/UserContext";
import {
  Box,
  Menu,
  IconButton,
  Button,
  ListItemText,
  ListItem,
  List,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddrequestIcon from "@mui/icons-material/PostAddTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import MoreVertTwoToneIcon from "@mui/icons-material/MoreVertTwoTone";
//import ResponsiveFormDialog, { DialogType } from 'src/Components/Shared/ResponsiveFormDialog';
import { ProductModel } from "../../../models/mymodels";
//import InternalRequestForm from './SendInternalRequestForm';

const ButtonError = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.error.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.error.dark};
     }
    `,
);

const ButtonSuccess = styled(Button)(
  ({ theme }) => `
     background: ${theme.colors.success.main};
     color: ${theme.palette.error.contrastText};

     &:hover {
        background: ${theme.colors.success.dark};
     }
    `,
);

//const prepareFormElements = (reqProducts: ProductModel[]) => {
//      if (!reqProducts || reqProducts.length <0) {
//          return <Fragment><div></div> </Fragment>;
//    }
//    else if (reqProducts.length>0) {
//          return (
//              <Fragment>
//                  <div>
//                      <FormControl fullWidth focused>
//                          <InputLabel htmlFor="my-input">Notes</InputLabel>
//                          <Input  id="my-input" aria-describedby="my-helper-text" />
//                         {/* <FormHelperText id="my-helper-text">Enter your notes here.</FormHelperText>*/}
//                      </FormControl>

//                      {reqProducts.map((product) => {
//                          return (
//                              <div key={product.id}  >
//                                  {product.id} - {product.name}<br></br>
//                              </div>
//                          );
//                      })}
//                  </div>

//              </Fragment>
//          );
//    }

//};
//onClick={condition && value}, pass onClick={condition ? value : undefined}

interface myProps {
  //selectedProducts: ProductModel[];
  //  openFormFunc: Function;
  openInternalReqFormFunc: any;
  openCreatePOFormFunc: any;
}

const BulkActions: FC<myProps> = ({
  openInternalReqFormFunc,
  openCreatePOFormFunc,
}) => {
  const userContext = useAuth();
  const [onMenuOpen, menuOpen] = useState<boolean>(false);
  const moreRef = useRef<HTMLButtonElement | null>(null);
  //  const prepareFormElements1 = InternalRequestForm(selectedProducts);

  const openMenu = (): void => {
    menuOpen(true);
  };

  const closeMenu = (): void => {
    menuOpen(false);
  };

  //   const openDialogNow = (): void => {

  //    setdialogTitle('Send Internal Request');
  //    setdialogType("Info");
  //   // setdialogMessage(prepareFormElements(selectedProducts));
  //  //  setdialogMessage(InternalRequestForm(selectedProducts));
  //    setOpenDialog(true);

  //};

  //const [dialogTitle, setdialogTitle] = useState("");
  ///*const [dialogMessage, setdialogMessage] = useState<any>("");*/
  //const [dialogType, setdialogType] = useState<DialogType>("");
  //const [openDialog, setOpenDialog] = useState<boolean>(false);

  //const openDialogNow = (): void => {

  //    setdialogTitle('Send Internal Request');
  //    setdialogType("Info");
  //   // setdialogMessage(prepareFormElements(selectedProducts));
  //  //  setdialogMessage(InternalRequestForm(selectedProducts));
  //    setOpenDialog(true);

  //};

  //useEffect(() => {
  //    if (openDialogNOW1==true) {
  //       openDialogNow();
  //     //   console.log("dddddddd");
  //    }
  //}, []);

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          {/*<Typography variant="h5" color="text.secondary">*/}

          {/*        </Typography>*/}
          {userContext?.currentUser &&
            userContext?.currentUser?.claimCanMakeRequest && (
              <ButtonSuccess
                onClick={openInternalReqFormFunc}
                sx={{ ml: 1 }}
                startIcon={<AddrequestIcon fontSize="small" />}
                variant="contained"
              >
                Request Items
              </ButtonSuccess>
            )}
          {userContext?.currentUser &&
            userContext?.currentUser?.claimCanMakePo && (
              <ButtonSuccess
                onClick={openCreatePOFormFunc}
                sx={{ ml: 1 }}
                startIcon={<AddrequestIcon fontSize="small" />}
                variant="contained"
              >
                Create Order
              </ButtonSuccess>
            )}
        </Box>
        <IconButton
          color="primary"
          onClick={openMenu}
          ref={moreRef}
          sx={{ ml: 2, p: 1 }}
        >
          <MoreVertTwoToneIcon />
        </IconButton>
      </Box>

      <Menu
        keepMounted
        anchorEl={moreRef.current}
        open={onMenuOpen}
        onClose={closeMenu}
        anchorOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "center",
          horizontal: "center",
        }}
      >
        <List sx={{ p: 1 }} component="nav">
          <ListItem button>
            <ListItemText primary="Export List.." />
          </ListItem>
        </List>
      </Menu>
    </>
  );
};

export default BulkActions;
