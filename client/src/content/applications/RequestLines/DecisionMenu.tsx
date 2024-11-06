import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import { FC, ReactNode, useEffect, useState } from "react";
import { updateDecisionOfRequest } from "../../../services/user.service";
import { CustomRequestLinesModel } from "../../../models/mymodels";
import { useAuth } from "src/contexts/UserContext";

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
}
interface DecArray {
  newstatusid: number;
  newstatustext: string;
}

const DecisionMenuButton: FC<MyProps> = ({
  color = "primary",
  buttonvaluetext,
  linereqID,
  setreqlines,
}) => {
  const userContext = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [response, setResponse] = useState<CustomRequestLinesModel | null>(
    null,
  );

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    requestDecision: string,
  ): void => {
    switch (requestDecision) {
      case "Approved":
        break;
      case "Pending Approval":
        break;
      case "Cancelled":
        break;
      case "Rejected":
        break;
      default:
        return;
    }
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const menuItemsAvailablePerCurrentDecision = (
    requestCurrentDecision: string,
  ): Array<DecArray> => {
    let arrtoreturn: Array<DecArray> = [];

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

  useEffect(() => {
    setreqlines(response);
  }, [response]);


  function callYourAPI(lreqID: number, newstatusid: number) {
    updateDecisionOfRequest(lreqID, newstatusid)
      .then((res) => {
        if (res.status === 200) {
          setResponse(res.data);
        } else {
          setResponse(null);
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
        setResponse(null);
      });

    handleClose();
  }

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
          {buttonvaluetext &&
            menuItemsAvailablePerCurrentDecision(buttonvaluetext).map(
              (options) => (
                <MenuItem
                  key={options.newstatusid}
                  onClick={() => callYourAPI(linereqID, options.newstatusid)}
                >
                  {options.newstatustext}
                </MenuItem>
              ),
            )


          }


        </Menu>
      )}
    </div>
  );
};



export default DecisionMenuButton;
