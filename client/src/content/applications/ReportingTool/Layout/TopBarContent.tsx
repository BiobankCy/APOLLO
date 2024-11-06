import React from "react";
import { useState, SyntheticEvent } from "react";
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
import RefreshTwoToneIcon from "@mui/icons-material/RefreshOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";
import ColorLensTwoToneIcon from "@mui/icons-material/ColorLensTwoTone";
import EmojiEmotionsTwoToneIcon from "@mui/icons-material/EmojiEmotionsTwoTone";

const RootWrapper = styled(Box)(
  ({ theme }) => `
        @media (min-width: ${theme.breakpoints.values.sm}px) {
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
  refreshFN?: () => void;
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
            alt="Reports"
            src="/static/images/overview/logo.png"
          />
          <Box ml={1}>
            <Typography variant="h4">Reports</Typography>
            <Typography variant="subtitle1">
              {/*{formatDistance(subMinutes(new Date(), 8), new Date(), {*/}
              {/*  addSuffix: true*/}
              {/*})}*/}
              Reporting Tool.
            </Typography>
          </Box>
        </Box>
        <Box
  sx={{
    // display: { xs: "flex" },
    // display: { xs: "none", md: "flex" },
  }}
>
  <Tooltip
    sx={{
      display: { xs: "flex" },
      // display: { xs: "none", md: "flex" },
    }}
    placement="bottom"
    title="Refresh"
  >
    <span>
      <IconButton disabled color="primary" onClick={props.refreshFN}>
        <RefreshTwoToneIcon />
      </IconButton>
    </span>
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
          {/*<Box*/}
          {/*  sx={{*/}
          {/*    textAlign: 'center'*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <Avatar*/}
          {/*    sx={{*/}
          {/*      mx: 'auto',*/}
          {/*      my: 2,*/}
          {/*      width: theme.spacing(12),*/}
          {/*      height: theme.spacing(12)*/}
          {/*    }}*/}
          {/*    variant="rounded"*/}
          {/*    alt="Zain Baptista"*/}
          {/*    src="/static/images/avatars/1.jpg"*/}
          {/*  />*/}
          {/*  <Typography variant="h4">Zain Baptista</Typography>*/}
          {/*  <Typography variant="subtitle2">*/}
          {/*    Active{' '}*/}
          {/*    {formatDistance(subMinutes(new Date(), 7), new Date(), {*/}
          {/*      addSuffix: true*/}
          {/*    })}*/}
          {/*  </Typography>*/}
          {/*</Box>*/}
          {/*<Divider*/}
          {/*  sx={{*/}
          {/*    my: 3*/}
          {/*  }}*/}
          {/*/>*/}

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
          {/*<Accordion*/}
          {/*  expanded={expanded === 'section2'}*/}
          {/*  onChange={handleChange('section2')}*/}
          {/*>*/}
          {/*  <AccordionSummaryWrapper expandIcon={<ExpandMoreIcon />}>*/}
          {/*    <Typography variant="h5">Privacy & Support</Typography>*/}
          {/*  </AccordionSummaryWrapper>*/}
          {/*  <AccordionDetails*/}
          {/*    sx={{*/}
          {/*      p: 0*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    <List component="nav">*/}
          {/*      <ListItem button>*/}
          {/*        <ListItemIconWrapper>*/}
          {/*          <NotificationsOffTwoToneIcon />*/}
          {/*        </ListItemIconWrapper>*/}
          {/*        <ListItemText*/}
          {/*          primary="Turn off notifications"*/}
          {/*          primaryTypographyProps={{ variant: 'h5' }}*/}
          {/*        />*/}
          {/*      </ListItem>*/}
          {/*      <ListItem button>*/}
          {/*        <ListItemIconWrapper>*/}
          {/*          <CancelTwoToneIcon />*/}
          {/*        </ListItemIconWrapper>*/}
          {/*        <ListItemText*/}
          {/*          primary="Ignore all messages"*/}
          {/*          primaryTypographyProps={{ variant: 'h5' }}*/}
          {/*        />*/}
          {/*      </ListItem>*/}
          {/*      <ListItem button>*/}
          {/*        <ListItemIconWrapper>*/}
          {/*          <BlockTwoToneIcon />*/}
          {/*        </ListItemIconWrapper>*/}
          {/*        <ListItemText*/}
          {/*          primary="Block user"*/}
          {/*          primaryTypographyProps={{ variant: 'h5' }}*/}
          {/*        />*/}
          {/*      </ListItem>*/}
          {/*      <ListItem button>*/}
          {/*        <ListItemIconWrapper>*/}
          {/*          <WarningTwoToneIcon />*/}
          {/*        </ListItemIconWrapper>*/}
          {/*        <ListItemText*/}
          {/*          primary="Something's Wrong"*/}
          {/*          primaryTypographyProps={{ variant: 'h5' }}*/}
          {/*          secondary="Report the conversation and provide feedback"*/}
          {/*          secondaryTypographyProps={{ variant: 'subtitle1' }}*/}
          {/*        />*/}
          {/*      </ListItem>*/}
          {/*    </List>*/}
          {/*  </AccordionDetails>*/}
          {/*</Accordion>*/}
          {/*<Accordion*/}
          {/*  expanded={expanded === 'section3'}*/}
          {/*  onChange={handleChange('section3')}*/}
          {/*>*/}
          {/*  <AccordionSummaryWrapper expandIcon={<ExpandMoreIcon />}>*/}
          {/*    <Typography variant="h5">Shared Files</Typography>*/}
          {/*  </AccordionSummaryWrapper>*/}
          {/*  <AccordionDetails*/}
          {/*    sx={{*/}
          {/*      p: 0*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    <List component="nav">*/}
          {/*      <ListItem button>*/}
          {/*        <ListItemIconWrapper>*/}
          {/*          <DescriptionTwoToneIcon />*/}
          {/*        </ListItemIconWrapper>*/}
          {/*        <ListItemText*/}
          {/*          primary="HolidayPictures.zip"*/}
          {/*          primaryTypographyProps={{ variant: 'h5' }}*/}
          {/*          secondary="You opened in the past year"*/}
          {/*          secondaryTypographyProps={{ variant: 'subtitle1' }}*/}
          {/*        />*/}
          {/*      </ListItem>*/}
          {/*      <ListItem button>*/}
          {/*        <ListItemIconWrapper>*/}
          {/*          <DescriptionTwoToneIcon />*/}
          {/*        </ListItemIconWrapper>*/}
          {/*        <ListItemText*/}
          {/*          primary="2021Screenshot.jpg"*/}
          {/*          primaryTypographyProps={{ variant: 'h5' }}*/}
          {/*          secondary="You edited this file yesterday"*/}
          {/*          secondaryTypographyProps={{ variant: 'subtitle1' }}*/}
          {/*        />*/}
          {/*      </ListItem>*/}
          {/*      <ListItem button>*/}
          {/*        <ListItemIconWrapper>*/}
          {/*          <DescriptionTwoToneIcon />*/}
          {/*        </ListItemIconWrapper>*/}
          {/*        <ListItemText*/}
          {/*          primary="PresentationDeck.pdf"*/}
          {/*          primaryTypographyProps={{ variant: 'h5' }}*/}
          {/*          secondary="Never opened"*/}
          {/*          secondaryTypographyProps={{ variant: 'subtitle1' }}*/}
          {/*        />*/}
          {/*      </ListItem>*/}
          {/*    </List>*/}
          {/*  </AccordionDetails>*/}
          {/*</Accordion>*/}
        </Box>
      </Drawer>
    </>
  );
}

export default TopBarContent;
