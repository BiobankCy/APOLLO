import { useContext } from "react";

import {
  ListSubheader,
  alpha,
  Box,
  List,
  styled,
  Button,
  ListItem,
} from "@mui/material";
import { NavLink as RouterLink } from "react-router-dom";
import { SidebarContext } from "../../../../contexts/SidebarContext";

import DesignServicesTwoToneIcon from "@mui/icons-material/DesignServicesTwoTone";

import TableChartTwoToneIcon from "@mui/icons-material/TableChartTwoTone";
import { useAuth } from "../../../../contexts/UserContext";
import React from "react";

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    padding: ${theme.spacing(1)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.colors.alpha.trueWhite[50]};
      padding: ${theme.spacing(0, 2.5)};
      line-height: 1.4;
    }
`,
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};

          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
            color: ${theme.palette.primary.contrastText};
          }
        }
    
        .MuiButton-root {
          display: flex;
          color: ${theme.colors.alpha.trueWhite[70]};
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(["color"])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${theme.colors.alpha.trueWhite[30]};
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }
          
          .MuiButton-endIcon {
            color: ${theme.colors.alpha.trueWhite[50]};
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.active,
          &:hover {
            background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
            color: ${theme.colors.alpha.trueWhite[100]};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: ${theme.colors.alpha.trueWhite[100]};
                opacity: 0;
                transition: ${theme.transitions.create([
    "transform",
    "opacity",
  ])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`,
);

function SidebarMenu() {
  const { closeSidebar } = useContext(SidebarContext);
  const userContext = useAuth();
  return (
    <>
      <MenuWrapper>
        <List component="div">
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/home"
                  startIcon={<DesignServicesTwoToneIcon />}
                >
                  Home
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>

        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              MANAGE
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/products"
                  startIcon={<TableChartTwoToneIcon />}
                >
                  Products
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/requests"
                  startIcon={<TableChartTwoToneIcon />}
                >
                  Requests
                </Button>
              </ListItem>



              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/purchase-orders-by-item"
                  startIcon={<TableChartTwoToneIcon />}
                >
                  Orders
                </Button>
              </ListItem>

              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/suppliers"
                  startIcon={<TableChartTwoToneIcon />}
                >
                  Suppliers
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/manufacturers"
                  startIcon={<TableChartTwoToneIcon />}
                >
                  Manufacturers
                </Button>
              </ListItem>

              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/tenders"
                  startIcon={<TableChartTwoToneIcon />}
                >
                  Tenders
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/projects"
                  startIcon={<TableChartTwoToneIcon />}
                >
                  Projects
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/categories"
                  startIcon={<TableChartTwoToneIcon />}
                >
                  Categories
                </Button>
              </ListItem>

              {userContext &&
                userContext.currentUser &&
                userContext.currentUser.claimCanViewReports === false ? null : (
                <ListItem component="div">
                  <Button
                    disableRipple
                    component={RouterLink}
                    onClick={closeSidebar}
                    to="/management/reporting"
                    startIcon={<TableChartTwoToneIcon />}
                  >
                    Reports
                  </Button>
                </ListItem>
              )}
            </List>
          </SubMenuWrapper>
        </List>

        <List
          component="div"
          subheader={
            <ListSubheader component="div" disableSticky>
              Inventory
            </ListSubheader>
          }
        >
          <SubMenuWrapper>
            <List component="div">


              {userContext &&
                userContext.currentUser &&
                userContext.currentUser.claimCanMakeInventoryAdjustment ===
                false ? null : (
                <ListItem component="div">
                  <Button
                    disableRipple
                    component={RouterLink}
                    onClick={closeSidebar}
                    to="/management/inventoryadjustment"
                    startIcon={<TableChartTwoToneIcon />}
                  >
                    Adjustment
                  </Button>
                </ListItem>
              )}

              {userContext &&
                userContext.currentUser &&
                userContext.currentUser.claimCanTransferStock === false ? null : (
                <ListItem component="div">
                  <Button
                    disableRipple
                    component={RouterLink}
                    onClick={closeSidebar}
                    to="/management/inventorytransfer"
                    startIcon={<TableChartTwoToneIcon />}
                  >
                    Transfer
                  </Button>
                </ListItem>
              )}

              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/locations"
                  startIcon={<TableChartTwoToneIcon />}
                >
                  Locations
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/management/lots"
                  startIcon={<TableChartTwoToneIcon />}
                >
                  Lots
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>

      </MenuWrapper>
    </>
  );
}

export default SidebarMenu;
