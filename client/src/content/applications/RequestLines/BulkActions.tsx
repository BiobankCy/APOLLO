import React from "react";
import { useState, FC } from "react";
import { useAuth } from "src/contexts/UserContext";
import { Box, Menu, Button, MenuProps } from "@mui/material";

import AddrequestIcon from "@mui/icons-material/PostAddTwoTone";
import { Approval, Cancel, Unpublished } from "@mui/icons-material";

import { styled, alpha } from "@mui/material/styles";

import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

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

  openCreatePOFormFunc: () => void;
  handleBulkDecisionChoosedforSelectedLines: (message: string) => void;
}

const BulkActions: FC<myProps> = ({
  openCreatePOFormFunc,
  handleBulkDecisionChoosedforSelectedLines,
}) => {
  const userContext = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openDecisionsMenu = Boolean(anchorEl);
  const handleClickBulkDecisionBtn = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseDecisionsMenu = () => {
    setAnchorEl(null);
  };


  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          {/*<Typography variant="h5" color="text.secondary">*/}
          {/*  Bulk actions:*/}
          {/*        </Typography>*/}

          {/*<ButtonSuccess*/}
          {/*    onClick={openInternalReqFormFunc}*/}
          {/*    sx={{ ml: 1 }}*/}
          {/*    startIcon={<AddrequestIcon fontSize="small" />}*/}
          {/*    variant="contained">*/}
          {/*  Request Items*/}
          {/*</ButtonSuccess>*/}
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

          {userContext?.currentUser && (
            <>
              <ButtonSuccess
                id="demo-customized-button"
                aria-controls={
                  openDecisionsMenu ? "demo-customized-menu" : undefined
                }
                aria-haspopup="true"
                aria-expanded={openDecisionsMenu ? "true" : undefined}
                variant="contained"
                disableElevation
                onClick={handleClickBulkDecisionBtn}
                sx={{ ml: 1 }}
                startIcon={<Approval fontSize="small" />}
                endIcon={<KeyboardArrowDownIcon />}
              >
                Bulk Decision
              </ButtonSuccess>

              <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                  "aria-labelledby": "demo-customized-button",
                }}
                anchorEl={anchorEl}
                open={openDecisionsMenu}
                onClose={handleCloseDecisionsMenu}
              >
                <MenuItem
                  onClick={(event) => {
                    handleBulkDecisionChoosedforSelectedLines("Approve");
                    handleCloseDecisionsMenu();
                  }}
                  disableRipple
                >
                  <Approval />
                  Approve
                </MenuItem>
                <MenuItem
                  onClick={(event) => {
                    handleBulkDecisionChoosedforSelectedLines("Reject");
                    handleCloseDecisionsMenu();
                  }}
                  disableRipple
                >
                  <Unpublished />
                  Reject
                </MenuItem>
                <MenuItem
                  onClick={(event) => {
                    handleBulkDecisionChoosedforSelectedLines("Cancel");
                    handleCloseDecisionsMenu();
                  }}
                  disableRipple
                >
                  <Cancel />
                  Cancel
                </MenuItem>

                {/*<Divider sx={{ my: 0.5 }} />*/}
              </StyledMenu>
            </>
          )}
        </Box>
      </Box>
    </>
  );
};

export default BulkActions;
