import {
  alpha,
  Badge,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  Popover,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import NotificationsActiveTwoToneIcon from "@mui/icons-material/NotificationsActiveTwoTone";
import { styled } from "@mui/material/styles";

import { formatDistance } from "date-fns";
import { NotificationModel } from "../../../../../models/mymodels";
import { getAllNotifications } from "../../../../../services/user.service";
import React from "react";
import { GLOBALVAR_NOTIFICATIONS_REFRESH_MINS } from "src/Settings/AppSettings";

const NotificationsBadge = styled(Badge)(
  ({ theme }) => `
    
    .MuiBadge-badge {
        background-color: ${alpha(theme.palette.success.main, 1)};
        color: ${theme.palette.common.white};
        min-width: 16px; 
        height: 16px;
        padding: 1px;

        &::after {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            box-shadow: 0 0 0 1px ${alpha(theme.palette.success.dark, 1)};
            content: "";
        }
    }
`,
);

function HeaderNotifications() {
  const ref = useRef<any>(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  useEffect(() => {
    // Function to fetch notifications count and update the state
    const updateNotificationsCount = async () => {
      try {
        const response = await getAllNotifications();
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    // Fetch notifications count immediately when the component mounts
    updateNotificationsCount();

    // Fetch notifications count every 1 minute (60,000 milliseconds)
    const interval = setInterval(updateNotificationsCount,  (Number( GLOBALVAR_NOTIFICATIONS_REFRESH_MINS) ?? 1)* 60*1000);

    // Clean up the interval when the component is unmounted
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  return (
    <>
      <Tooltip arrow title="Notifications">
        <IconButton
          color={notifications.length > 0 ? "success" : "default"}
          ref={ref}
          onClick={handleOpen}
        >
          <NotificationsBadge
            badgeContent={notifications.length}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <NotificationsActiveTwoToneIcon />
          </NotificationsBadge>
        </IconButton>
      </Tooltip>
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
        <Box
          sx={{ p: 2 }}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h5">Notifications</Typography>
        </Box>
        <Divider />
        <List sx={{ p: 0 }}>
          {notifications.map((notification) => (
            <ListItem
              key={notification.id}
              sx={{ p: 2, minWidth: 350, display: { xs: "block", sm: "flex" } }}
            >
              <Box flex="1">
                <Box display="flex" justifyContent="space-between">
                  <Typography sx={{ fontWeight: "bold" }}>
                    {notification.title}
                  </Typography>
                  {notification.date && (
                    <Typography
                      variant="caption"
                      sx={{ textTransform: "none" }}
                    >
                      {formatDistance(new Date(notification.date), new Date(), {
                        addSuffix: true,
                      })}
                    </Typography>
                  )}
                </Box>
                <Typography
                  component="span"
                  variant="body2"
                  color="text.secondary"
                >
                  {notification.message}
                </Typography>
              </Box>
            </ListItem>
          ))}
           
        </List>
      </Popover>
    </>
  );
}

export default HeaderNotifications;
