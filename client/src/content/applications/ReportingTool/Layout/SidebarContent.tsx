import React from "react";
import { useState, SyntheticEvent } from "react";
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItemButton,
  ListItemText,
  lighten,
  styled,
  ListItem,
  ListItemIcon,
  Accordion,
  AccordionDetails,
  useTheme,
  AccordionSummary,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchTwoToneIcon from "@mui/icons-material/SearchTwoTone";

import { AdjustmentItemModel, ProductModel } from "../../../../models/mymodels";
import { ReportCategoryModel, ReportModel } from "../Reports/Models/AllInterfaces";
 

const RootWrapper = styled(Box)(
  ({ theme }) => `
        padding: ${theme.spacing(2.5)};
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
  //addItem: (item: AdjustmentItemModel) => void;
  reports: ReportCategoryModel[];
  handleReportSelection: (report: ReportModel) => void;
  //prodList: ProductModel[];
  //locsList: LocationModel[];
  //lotsList: LotModel[];
  //prodCondStatusList: ItemConditionStatusModel[];
}

function SidebarContent(props: ChildComponentProps) {
  const { reports, handleReportSelection } = props;

  //function handleAddItem(item: AdjustmentItemModel) {

  //    props.addItem(item);
  //    resetInputs();
  //}

  // const [filteredprodList, setfilteredprodList] = useState<ProductModel[]>(prodList.length ? prodList : []);
 // const [productSelected, setproductSelected] = useState<ProductModel>();

  //useEffect(() => {
  //    setfilteredprodList(prodList);
  //}, [prodList]);

  //function resetInputs():void {

  //    setproductSelected(undefined);

  //}

  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange =
    (section: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? section : false);
    };

  return (
    <RootWrapper>
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

        {reports.map((category, index) => (
          <Accordion
            key={index}
            expanded={expanded === `category-${index}`}
            onChange={handleChange(`category-${index}`)}
          >
            <AccordionSummaryWrapper expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h5">{category.category}</Typography>
            </AccordionSummaryWrapper>
            <AccordionDetails
              sx={{
                p: 0,
              }}
            >
              <List component="nav">
                {category.reports.map((report, index) => (
                  <ListItem
                    key={index}
                    button
                    onClick={() => handleReportSelection(report)}
                  >
                    <ListItemIconWrapper>
                      <SearchTwoToneIcon />
                    </ListItemIconWrapper>
                    <ListItemText
                      primary={report.shortname}
                      primaryTypographyProps={{ variant: "h5" }}
                    />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </RootWrapper>
  );
}

export default SidebarContent;
