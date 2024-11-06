import {
  Box,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { styled } from "@mui/material/styles";
import ExpandMoreTwoToneIcon from "@mui/icons-material/ExpandMoreTwoTone";
import { useAuth } from "../../../../contexts/UserContext";
import React from "react";

const ListWrapper = styled(Box)(
  ({ theme }) => `
        .MuiTouchRipple-root {
            display: none;
        }
        
        .MuiListItem-root {
            transition: ${theme.transitions.create(["color", "fill"])};
            
            &.MuiListItem-indicators {
                padding: ${theme.spacing(1, 2)};
            
                .MuiListItemText-root {
                    .MuiTypography-root {
                        &:before {
                            height: 4px;
                            width: 22px;
                            opacity: 0;
                            visibility: hidden;
                            display: block;
                            position: absolute;
                            bottom: -10px;
                            transition: all .2s;
                            border-radius: ${theme.general.borderRadiusLg};
                            content: "";
                            background: ${theme.colors.primary.main};
                        }
                    }
                }

                &.active,
                &:active,
                &:hover {
                
                    background: transparent;
                
                    .MuiListItemText-root {
                        .MuiTypography-root {
                            &:before {
                                opacity: 1;
                                visibility: visible;
                                bottom: 0px;
                            }
                        }
                    }
                }
            }
        }
`,
);

function HeaderMenu() {
  const userContext = useAuth();
  const ref = useRef<any>(null);
  const ref2 = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [isOpen1, setOpen1] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleClose1 = (): void => {
    setOpen1(false);
  };

  return (
    <>
      <ListWrapper
        sx={{
          display: {
            xs: "none",
            md: "block",
          },
        }}
      >
        <List disablePadding component={Box} display="flex">
          <ListItem
            classes={{ root: "MuiListItem-indicators" }}
            button
            component={NavLink}
            to="/management/products"
          >
            <ListItemText
              primaryTypographyProps={{ noWrap: true }}
              primary="Products"
            />
          </ListItem>

          <ListItem
            classes={{ root: "MuiListItem-indicators" }}
            button
            component={NavLink}
            to="/management/requests"
          >
            <ListItemText
              primaryTypographyProps={{ noWrap: true }}
              primary="Requests"
            />
          </ListItem>

          <ListItem
            classes={{ root: "MuiListItem-indicators" }}
            button
            component={NavLink}
            to="/management/purchase-orders-by-item"
          >
            <ListItemText
              primaryTypographyProps={{ noWrap: true }}
              primary="Orders"
            />
          </ListItem>

          <ListItem
            classes={{ root: "MuiListItem-indicators" }}
            button
            component={NavLink}
            to="/management/suppliers"
          >
            <ListItemText
              primaryTypographyProps={{ noWrap: true }}
              primary="Suppliers"
            />
          </ListItem>

          
          <ListItem
            classes={{ root: "MuiListItem-indicators" }}
            button
            component={NavLink}
            to="/management/manufacturers"
          >
            <ListItemText
              primaryTypographyProps={{ noWrap: true }}
              primary="Manufacturers"
            />
          </ListItem>

          <ListItem
            classes={{ root: "MuiListItem-indicators" }}
            button
            component={NavLink}
            to="/management/tenders"
          >
            <ListItemText
              primaryTypographyProps={{ noWrap: true }}
              primary="Tenders"
            />
          </ListItem>

          <ListItem
            classes={{ root: "MuiListItem-indicators" }}
            button
            component={NavLink}
            to="/management/projects"
          >
            <ListItemText
              primaryTypographyProps={{ noWrap: true }}
              primary="Projects"
            />
          </ListItem>

          <ListItem
            classes={{ root: "MuiListItem-indicators" }}
            button
            component={NavLink}
            to="/management/categories"
          >
            <ListItemText
              primaryTypographyProps={{ noWrap: true }}
              primary="Categories"
            />
          </ListItem>

          {userContext &&
          userContext.currentUser &&
          userContext.currentUser.claimCanViewReports === false ? null : (
            <ListItem
              classes={{ root: "MuiListItem-indicators" }}
              button
              component={NavLink}
              to="/management/reporting"
            >
              <ListItemText
                primaryTypographyProps={{ noWrap: true }}
                primary="Reports"
              />
            </ListItem>
          )}

          <ListItem
            classes={{ root: "MuiListItem-indicators" }}
            button
            ref={ref}
            onClick={handleOpen}
          >
            <ListItemText
              primaryTypographyProps={{ noWrap: true }}
              primary={
                <Box display="flex" alignItems="center">
                  Inventory
                  <Box display="flex" alignItems="center" pl={0.3}>
                    <ExpandMoreTwoToneIcon fontSize="small" />
                  </Box>
                </Box>
              }
            />
          </ListItem>
        
        </List>
      </ListWrapper>

      <Menu anchorEl={ref.current} onClose={handleClose} open={isOpen}>
        {userContext &&
        userContext.currentUser &&
        userContext.currentUser.claimCanMakeInventoryAdjustment ===
          false ? null : (
          <MenuItem
            sx={{ px: 3 }}
            component={NavLink}
            to="/management/inventoryadjustment"
            onClick={handleClose}
          >
            Adjustment
          </MenuItem>
        )}

        {userContext &&
        userContext.currentUser &&
        userContext.currentUser.claimCanTransferStock === false ? null : (
          <MenuItem
            sx={{ px: 3 }}
            component={NavLink}
            to="/management/inventorytransfer"
            onClick={handleClose}
          >
            Transfer
          </MenuItem>
        )}

        <MenuItem
          sx={{ px: 3 }}
          component={NavLink}
          to="/management/locations"
          onClick={handleClose}
        >
          Locations
        </MenuItem>

        <MenuItem
          sx={{ px: 3 }}
          component={NavLink}
          to="/management/lots"
          onClick={handleClose}
        >
          Lots
        </MenuItem>
      </Menu>

    
    </>
  );
}

export default HeaderMenu;
