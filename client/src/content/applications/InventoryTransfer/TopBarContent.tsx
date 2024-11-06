import { useState, SyntheticEvent } from "react";
import React from "react";
import {
  Box,
  IconButton,
  Tooltip,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Drawer,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  styled,
  useTheme,
} from "@mui/material";
import CallTwoToneIcon from "@mui/icons-material/ClearOutlined";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import ColorLensTwoToneIcon from "@mui/icons-material/ColorLensTwoTone";
import EmojiEmotionsTwoToneIcon from "@mui/icons-material/EmojiEmotionsTwoTone";

const RootWrapper = styled(Box)(
  ({ theme }) => `
        @media (min-width: ${theme.breakpoints.values.md}px) {
          display: flex;
          align-items: center;
          justify-content: space-between;
      }
`,
);

const ListItemIconWrapper = styled(ListItemIcon)(
  ({ theme }) => `
        min-width: 36px;
        color: ${theme.colors.primary.light};
`,
);

const AccordionSummaryWrapper = styled(AccordionSummary)(
  ({ theme }) => `
        &.Mui-expanded {
          min-height: 48px;
        }

        .MuiAccordionSummary-content.Mui-expanded {
          margin: 12px 0;
        }

        .MuiSvgIcon-root {
          transition: ${theme.transitions.create(["color"])};
        }

        &.MuiButtonBase-root {

          margin-bottom: ${theme.spacing(0.5)};

          &:last-child {
            margin-bottom: 0;
          }

          &.Mui-expanded,
          &:hover {
            background: ${theme.colors.alpha.black[10]};

            .MuiSvgIcon-root {
              color: ${theme.colors.primary.main};
            }
          }
        }
`,
);

interface ChildComponentProps {
  clearList: () => void;
}

function TopBarContent(props: ChildComponentProps) {
  const theme = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [expanded, setExpanded] = useState<string | false>("section1");

  const handleChange =
    (section: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? section : false);
    };

  return (
    <>
      <RootWrapper>
        <Box display="flex" alignItems="center">
          <Avatar
            variant="rounded"
            sx={{
              width: 48,
              height: 48,
            }}
            alt="Inventory Transfer"
            src="/static/images/overview/logo.png"
          />
          <Box ml={1}>
            <Typography variant="h4">Inventory Transfer</Typography>
            <Typography variant="subtitle1">
              {/*{formatDistance(subMinutes(new Date(), 8), new Date(), {*/}
              {/*  addSuffix: true*/}
              {/*})}*/}
              Transfer inventory items between locations.
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: { xs: "none", lg: "flex" },
          }}
        >
          <Tooltip placement="bottom" title="Clear Transfer List">
            <IconButton color="primary" onClick={props.clearList}>
              <CallTwoToneIcon />
            </IconButton>
          </Tooltip>
          {/*<Tooltip placement="bottom" title="Start a video call">*/}
          {/*  <IconButton color="primary">*/}
          {/*    <VideoCameraFrontTwoToneIcon />*/}
          {/*  </IconButton>*/}
          {/*</Tooltip>*/}
          <Tooltip placement="bottom" title="Information">
            <IconButton color="primary" onClick={handleDrawerToggle}>
              <InfoTwoToneIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </RootWrapper>
      <Drawer
        sx={{
          display: { xs: "none", md: "flex" },
        }}
        variant="temporary"
        anchor={theme.direction === "rtl" ? "left" : "right"}
        open={mobileOpen}
        onClose={handleDrawerToggle}
        elevation={9}
      >
        <Box
          sx={{
            minWidth: 360,
          }}
          p={2}
        >


          <Accordion
            expanded={expanded === "section1"}
            onChange={handleChange("section1")}
          >
            <AccordionSummaryWrapper expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">Customize 1</Typography>
            </AccordionSummaryWrapper>
            <AccordionDetails
              sx={{
                p: 0,
              }}
            >
              <List component="nav">
                <ListItem button>
                  <ListItemIconWrapper>
                    <SearchTwoToneIcon />
                  </ListItemIconWrapper>
                  <ListItemText
                    primary="Item 1"
                    primaryTypographyProps={{ variant: "h5" }}
                  />
                </ListItem>
                <ListItem button>
                  <ListItemIconWrapper>
                    <ColorLensTwoToneIcon />
                  </ListItemIconWrapper>
                  <ListItemText
                    primary="Item 2"
                    primaryTypographyProps={{ variant: "h5" }}
                  />
                </ListItem>
                <ListItem button>
                  <ListItemIconWrapper>
                    <EmojiEmotionsTwoToneIcon />
                  </ListItemIconWrapper>
                  <ListItemText
                    primary="Item 3"
                    primaryTypographyProps={{ variant: "h5" }}
                  />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>

        </Box>
      </Drawer>
    </>
  );
}

export default TopBarContent;
