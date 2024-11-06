import React, { useState, Fragment } from "react";
import { Typography, Button } from "@mui/material";
import { availableStockAnalysisModel } from "src/models/mymodels";
import { format } from "date-fns";

import {
  Divider,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
} from "@mui/material";
import MailIcon from "@mui/icons-material/Inventory";


interface PostsProps {
  stocklist: availableStockAnalysisModel[];
  productid: number;
  availqty: number;
}



function Rightpopupstocklist(those: PostsProps) {
  // let anchor = "right";

  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  type Anchor = "top" | "left" | "bottom" | "right";
  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === "keydown" &&
          ((event as React.KeyboardEvent).key === "Tab" ||
            (event as React.KeyboardEvent).key === "Shift")
        ) {
          return;
        }

        setState({ ...state, [anchor]: open });
      };

  let anchora: Anchor = "right";

  return (
    <Fragment key={those.productid}>
      <Button onClick={toggleDrawer("right", true)}>{those.availqty}</Button>
      <Drawer
        anchor="right"
        open={state["right"]}
        onClose={toggleDrawer("right", false)}
      >
        <Box
          sx={{ width: 250 }}
          p={0}
          role="presentation"
          onClick={toggleDrawer(anchora, false)}
          onKeyDown={toggleDrawer(anchora, false)}
        >
          <Divider />
          <Box sx={{ mx: "auto", textAlign: "center" }}>
            <Typography variant="h3">Inventory Analysis</Typography>
            <Typography variant="h4">
              Total Available Quantity: {those.availqty}
            </Typography>
          </Box>

          <Divider />

          <List>
            {those.stocklist.map((line) => (
              <ListItem
                disablePadding
                alignItems="flex-start"
                key={line.lotnumber.toString() + line.locname.toString()}
                role={undefined}
              >
                <ListItemButton>
                  <ListItemIcon>
                    <MailIcon />
                  </ListItemIcon>

                  <ListItemText
                    primary={
                      <>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          noWrap
                        >
                          <span>Building: {line.buldingname}</span>
                          <br />
                          <span>Room: {line.roomname}</span>
                          <br />
                          <span>Loc: {line.locname}</span> <br />
                          <span>Loc. Type: {line.loctypename}</span> <br />
                          <span>Quantity: {line.qty}</span> <br />
                          <span>Lot: {line.lotnumber}</span>
                          {line.expdate ? (
                            <span>
                              <br />
                              Exp:{" "}
                              {format(new Date(line.expdate), "dd/MM/yyyy")}
                            </span>
                          ) : (
                            ""
                          )}
                          <br /> <span>Status: {line.conname}</span>
                          {line.si.length > 0 && line.ns.length > 0 && (
                            <>
                              <br />
                              <span>
                                SI: {line.si} <br />
                                NS: {line.ns}
                              </span>
                            </>
                          )}
                        </Typography>
                        <hr />
                      </>
                    }
                  />
                  
                </ListItemButton>
              </ListItem>

             
            ))}
          </List>
        </Box>
      </Drawer>
    </Fragment>
  );
}

export default Rightpopupstocklist;