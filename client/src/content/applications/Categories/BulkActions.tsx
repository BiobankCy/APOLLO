import { useState, useRef, FC } from "react";
import React from "react";
import { useAuth } from "src/contexts/UserContext";
import {
  Box,
  Menu,
  IconButton,
  Button,
  ListItemText,
  ListItem,
  List,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import AddrequestIcon from "@mui/icons-material/PostAddTwoTone";

import MoreVertTwoToneIcon from "@mui/icons-material/MoreVertTwoTone";

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
