import React, { Fragment, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import { updateDecisionOfRequest } from "../../../services/user.service";
import { CustomRequestLinesModel, ccyFormat } from "../../../models/mymodels";
import { useAuth } from "src/contexts/UserContext";
import styled from "@emotion/styled";
import { Divider, List, ListItemButton, ListItemText, ListSubheader, MenuList, Paper, Theme, useTheme } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { ListItemIcon } from '@mui/material';


interface StatusButtonProps {
  refreshUpdatedRow: any;
  reqline: CustomRequestLinesModel;
}

interface MyProps {
  color:
  | "inherit"
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "info"
  | "warning";
  buttonvaluetext: string;
  linereqID: number;
  setreqlines: any;
  response: CustomRequestLinesModel | null;
  totalcost: number | 0;
}


const StyledPaper = styled(Paper)(
  `border-radius: 0;
   color: black;
   text-align:center;
   
   
   `
);
const StyledMenuItem = styled(MenuItem)<{ status: string }>(({ status }) => ({
  '&:hover, &.Mui-focusVisible': {
    color: getActionDecisionColor(status) + ' !important',
    backgroundColor: '#ffffff !important',
  },
  backgroundColor: getActionDecisionColor(status),
  color: '#ffffff !important',
}));


const DecisionMenuButton: React.FC<MyProps> = ({
  color = "primary",
  buttonvaluetext,
  linereqID,
  setreqlines, totalcost,
  response,
}) => {
  const userContext = useAuth();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    requestDecision: string,
  ): void => {
    switch (requestDecision) {
      case "Approved":
      case "Pending Approval":
      case "Cancelled":
      case "Rejected":
        setAnchorEl(event.currentTarget);
        break;
      default:
        return;
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItemsAvailablePerCurrentDecision = (
    requestCurrentDecision: string,
  ): Array<{
    newstatusid: number;
    newstatustext: string;
  }> => {
    let arrtoreturn: Array<{ newstatusid: number; newstatustext: string }> = [];

    switch (requestCurrentDecision) {
      case "Pending Approval":
        arrtoreturn.push(
          {
            newstatusid: 2,
            newstatustext: "Approve",
          },
          {
            newstatusid: 3,
            newstatustext: "Reject",
          },
          {
            newstatusid: 5,
            newstatustext: "Cancel",
          },
        );
        break;
      case "Approved":
        arrtoreturn.push({
          newstatusid: 5,
          newstatustext: "Cancel",
        });
        break;
      case "Cancelled":
        arrtoreturn.push(
          {
            newstatusid: 2,
            newstatustext: "Approve",
          },
          {
            newstatusid: 3,
            newstatustext: "Reject",
          },
        );
        break;
      case "Rejected":
        arrtoreturn.push(
          {
            newstatusid: 2,
            newstatustext: "Approve",
          },
          {
            newstatusid: 5,
            newstatustext: "Cancel",
          },
        );
        break;
      default:
        return arrtoreturn;
    }

    return arrtoreturn;
  };

  function callYourAPI(lreqID: number, newstatusid: number) {
    updateDecisionOfRequest(lreqID, newstatusid)
      .then((res) => {
        if (res.status === 200) {
          setreqlines(res.data);
        } else {
          setreqlines(null);
          alert("Error! Cant Update Decision!(Status: " + res.statusText + ")");
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          // console.log(error.response.data);
          alert(error.response?.data); // Handle unauthorized error
        } else {
          alert(
            "General Error! Cant Update Decision!(Message: " +
            error.response?.data +
            ")",
          );
        }
        setreqlines(null);
      });

    handleClose();
  }

  const getActionColorByStatus = (theme: Theme, decision: string): string => {
    switch (decision.toLocaleLowerCase()) {
      case "approve":
        return theme.palette.grey[400]; // Use the theme palette color
      case "pending approval":
        return theme.palette.warning.main; // Warning color
      case "reject":
      case "canceld":
        return theme.palette.error.main; // Error color
      case "received":
        return theme.palette.success.main; // Success color
      default:
        return theme.palette.primary.main; // Primary color
    }
  };

  const getIconByStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approve':
        return <CheckCircleIcon sx={{ color: 'green' }} />;
      case 'cancel':
        return <CancelIcon sx={{ color: 'warning' }} />;
      case 'reject':
        return <CancelIcon sx={{ color: 'red' }} />;
      default:
        return <CheckCircleIcon sx={{ color: 'error' }} />;
    }
  };


  return (
    <div>
      <Button
        color={color}
        id="fade-button"
        aria-controls={open ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={(event) => handleClick(event, buttonvaluetext)}
      >
        {buttonvaluetext}
      </Button>

      {userContext && userContext.currentUser && buttonvaluetext && (
        <>
          <Menu
            id="fade-menu"
            MenuListProps={{
              "aria-labelledby": "fade-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            TransitionComponent={Fade}
          >
            <StyledPaper>
              <Divider sx={{ borderTop: 1 }} />
              Req. Line #{linereqID}
              <Divider sx={{ borderTop: 1 }} />
              <div>
                Current Line Total: {ccyFormat(totalcost)}
              </div>
              <Divider sx={{ borderTop: 1, paddingBottom: 2 }} />
              <List
                sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
                subheader={
                  <ListSubheader component="div" id="nested-list-subheader">
                    Choose Decision:
                  </ListSubheader>
                }
              >





                {buttonvaluetext &&
                  menuItemsAvailablePerCurrentDecision(buttonvaluetext).map((options) => (
                    // <StyledMenuItem
                    //   divider
                    //   key={options.newstatusid}
                    //   onClick={() => callYourAPI(linereqID, options.newstatusid)}
                    //   status={options.newstatustext} // Pass newstatustext as status prop
                    // >

                    //   {options.newstatustext}
                    // </StyledMenuItem>
                    <Fragment>
                      <ListItemButton key={options.newstatusid} onClick={() => callYourAPI(linereqID, options.newstatusid)}>
                        <ListItemIcon>
                          {getIconByStatus(options.newstatustext)}
                        </ListItemIcon>
                        <ListItemText primary={options.newstatustext} />
                      </ListItemButton>

                      {/* <ListItemText   key={options.newstatusid} onClick={() => callYourAPI(linereqID, options.newstatusid)} >
                <ListItemIcon  >
          {getIconByStatus(options.newstatustext)}
        </ListItemIcon> {options.newstatustext}</ListItemText> */}

                    </Fragment>
                  ))}
              </List>
            </StyledPaper>
          </Menu>
        </>
      )}
    </div>
  );
};

const LineStatusButton: React.FC<StatusButtonProps> = ({
  reqline,
  refreshUpdatedRow,
}) => {
  const userContext = useAuth();
  const [response, setResponse] = useState<CustomRequestLinesModel | null>(
    null,
  );

  const getStatusColor = (decision: string) => {
    switch (decision) {
      case "Approved":
        return "secondary";
      case "Pending Approval":
        return "warning";
      case "Rejected":
      case "Cancelled":
        return "error";
      case "Received":
        return "success";
      default:
        return "primary";
    }
  };




  useEffect(() => {
    setResponse(response);
  }, [response]);

  return (
    <DecisionMenuButton
      color={getStatusColor(reqline.linedynamicstatus)}
      buttonvaluetext={reqline.linedynamicstatus}
      linereqID={reqline.linereqid}
      setreqlines={refreshUpdatedRow}
      response={response}
      totalcost={(reqline.linepunitcost * (reqline.lineqty ?? 0))}
    />
  );
};

export default LineStatusButton;

const getActionDecisionColor = (status: string): string => {
  switch (status.toLocaleLowerCase()) {
    case "Approve".toLocaleLowerCase():
      return "purple";
    case "Pending Approval".toLocaleLowerCase():
      return "warning";
    case "Reject".toLocaleLowerCase():
      return "red";
    case "Cancel".toLocaleLowerCase():
      return "orange";

    default:
      return "orange";
  }
};


