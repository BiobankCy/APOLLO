import { useState, useRef, FC } from "react";
import React from "react";
import { useAuth } from "src/contexts/UserContext";
import {
  Box,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import {
  CustomPurchaseOrderLine,
} from "../../../models/mymodels";

import RightDrawerReceiving from "../../../Components/Shared/RightDrawerReceiving";

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
  selectedOrderLines: CustomPurchaseOrderLine[];
  refreshPORDERS: (porderid: number) => void;
}

const BulkActions: FC<myProps> = ({ selectedOrderLines, refreshPORDERS }) => {
  const userContext = useAuth();
  const [onMenuOpen, menuOpen] = useState<boolean>(false);
  const moreRef = useRef<HTMLButtonElement | null>(null);

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
            userContext?.currentUser?.claimCanReceiveItems && (
              <>
                {selectedOrderLines &&
                  selectedOrderLines.length > 0 &&
                  selectedOrderLines[0].pord && (
                    <RightDrawerReceiving
                      key={selectedOrderLines[0].orderid}
                      porderheader={selectedOrderLines[0].pord}
                      porderline={selectedOrderLines}
                      orderlinescount={selectedOrderLines.length ?? 0}
                      refreshUpdatedRow={refreshPORDERS}
                    //  refreshUpdatedRow={refreshUpdatedRow}
                    />
                  )}
              </>
            )}

        </Box>
      </Box>
    </>
  );
};

export default BulkActions;
