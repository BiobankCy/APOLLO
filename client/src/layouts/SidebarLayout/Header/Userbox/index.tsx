import React, { useState, useRef } from "react";

import { NavLink } from "react-router-dom";

import {
  Avatar,
  Box,
  Button,
  Divider,
  Hidden,
  lighten,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography,
} from "@mui/material";

import { styled } from "@mui/material/styles";
import ExpandMoreTwoToneIcon from "@mui/icons-material/ExpandMoreTwoTone";
import LockOpenTwoToneIcon from "@mui/icons-material/LockOpenTwoTone";
import AccountTreeTwoToneIcon from "@mui/icons-material/AccountTreeTwoTone";
import { useAuth } from "src/contexts/UserContext";
import { useTheme } from "@mui/material/styles";
import { hasAdminAccess } from "../../../../models/mymodels";

const UserBoxButton = styled(Button)(
  ({ theme }) => `
        padding-left: ${theme.spacing(1)};
        padding-right: ${theme.spacing(1)};
`,
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${theme.colors.alpha.black[5]};
        padding: ${theme.spacing(2)};
`,
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`,
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`,
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${lighten(theme.palette.secondary.main, 0.5)}
`,
);

function HeaderUserbox() {
  const userContext = useAuth();

  const theme = useTheme();

  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <UserBoxButton color="secondary" ref={ref} onClick={handleOpen}>
        <Avatar
          variant="rounded"
          alt={userContext?.currentUser?.fullname ?? ""}
          src={
            userContext?.currentUser?.avatar ??
            "/static/images/avatars/blank-avatar-small.jpg"
          }
        />
        <Hidden mdDown>
          <UserBoxText>
            <UserBoxLabel variant="body1">
              {userContext?.currentUser?.fullname ?? ""}
            </UserBoxLabel>
            <UserBoxDescription variant="body2">
              {userContext?.currentUser?.email ?? "No Job Title"}
            </UserBoxDescription>
          </UserBoxText>
        </Hidden>
        <Hidden smDown>
          <ExpandMoreTwoToneIcon sx={{ ml: 1 }} />
        </Hidden>
      </UserBoxButton>
      <Popover
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuUserBox sx={{ minWidth: 210 }} display="flex">
          <Avatar
            variant="rounded"
            alt={userContext?.currentUser?.fullname ?? ""}
            src={
              userContext?.currentUser?.avatar ??
              "/static/images/avatars/blank-avatar-small.jpg"
            }
          />
          <UserBoxText>
            <UserBoxLabel variant="body1">
              {userContext?.currentUser?.fullname ?? ""}
            </UserBoxLabel>
            <UserBoxDescription variant="body2">
              {userContext?.currentUser?.role.roleName ?? "No Role"}
              {/*<ul>*/}
              {/*    {userContext?.currentUser?.roles   &&*/}
              {/*        userContext.currentUser.roles.map((role: string, index: number) => <li key={index}>{role}</li>)}*/}
              {/*</ul>*/}
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider sx={{ mb: 0 }} />
        <List sx={{ p: 1  }} component="nav">
          
          <ListItem
        
            component={NavLink}
            onClick={handleClose}
            to="/management/user/settings"
            style={{ color: theme.palette.primary.main  }}
            sx={{
              color: 'primary', 
              "&.active": { background: theme.colors.primary.lighter },
            }}
          >
            <AccountTreeTwoToneIcon fontSize="small"   />
            <ListItemText primary="My Settings"  />
          </ListItem>

          {hasAdminAccess(userContext?.currentUser) && (
            <ListItem
              component={NavLink}
              onClick={handleClose}
              to="/management/application/settings"
              style={{ color: theme.palette.primary.main  }}
              sx={{
                color: 'primary', 
                "&.active": { background: theme.colors.primary.lighter },
              }}
            >
               <AccountTreeTwoToneIcon fontSize="small"   />
 
              <ListItemText primary="Application Settings"  />
            </ListItem>
          )}
        </List>

        <Divider />
        <Box sx={{ m: 1 }}>
          <Button color="primary" fullWidth onClick={userContext?.logout}>
            <LockOpenTwoToneIcon sx={{ mr: 1 }} />
            Logout
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderUserbox;
