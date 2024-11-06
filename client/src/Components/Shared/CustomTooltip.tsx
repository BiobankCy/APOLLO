import React, { useState, useEffect, useRef } from "react";
import {
  Tooltip,
  Divider,
  IconButton,
  useTheme,
  Zoom,
  Avatar,
} from "@mui/material";

import MoreRoundedIcon from "@mui/icons-material/MoreHorizTwoTone";
import {
  ccyFormat,
  customDateFormat,
  CustomRequestLinesModel,
  ProductModel,
  ProjectModel,
  stringAvatar,
} from "../../models/mymodels";
import { getSingleProduct, getSingleProject } from "../../services/user.service";

interface CustomTooltipProps {
  /* productId: number;*/
  title: string;
  /*  qty: number | 0;*/
  reqline: CustomRequestLinesModel;
}

function CustomProductInfoTooltip({ title, reqline }: CustomTooltipProps) {
  const [loading, setLoading] = useState(false);
  const [productInfo, setProductInfo] = useState<ProductModel | undefined>();
  const [projectInfo, setProjectInfo] = useState<ProjectModel | undefined>();
  const theme = useTheme();
  const isMounted = useRef(true);

  const handleTooltipOpen = async () => {
    setLoading(true);

    try {
      // console.log('API call started');
      const response = await getSingleProduct(reqline.linepid);

      if (isMounted.current) {
        //  console.log('set done:') ;
        setProductInfo(response.data);
        //     setProjectInfo(response2.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("API call failed:", error);
      if (isMounted.current) {
        setLoading(false);
      }
    }

    setLoading(true);

    try {

      const response2 = await getSingleProject(reqline.linereqid);

      if (isMounted.current) {

        setProjectInfo(response2.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("API call failed:", error);
      if (isMounted.current) {
        setLoading(false);
      }
    }



  };



  return (
    <>
      <Tooltip
        arrow
        TransitionComponent={Zoom}
        title={
          <>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <>
                {productInfo ? (
                  <>
                    <div>
                      Current Unit Cost: {ccyFormat(productInfo.costprice)}
                    </div>
                    <Divider sx={{ borderTop: 3 }} />
                    <div>
                      Current Line Total:{" "}
                      {ccyFormat(productInfo.costprice * reqline.lineqty)}
                    </div>
                    {productInfo.tenderName &&
                      productInfo.tenderName.length > 0 && (
                        <>
                          <Divider sx={{ borderTop: 3 }} />
                          <div>Tender: {productInfo.tenderName}</div>
                        </>
                      )}
                  </>
                ) : (
                  <div>{title}</div>
                )}

                {projectInfo ? (
                  <>
                    <div>
                      Project: {projectInfo.name}
                    </div>
                    <Divider sx={{ borderTop: 3 }} />
                    {/* <div>
                    For Project: {projectInfo.generalNotes}
                    </div> */}

                  </>
                ) : (
                  <div>{""}</div>
                )}
              </>
            )}
            <Divider sx={{ borderTop: 3 }} />
            {reqline &&
              reqline.linelastDecision &&
              reqline.linelastDecision?.madebyuser?.firstName +
              " " +
              reqline.linelastDecision?.madebyuser?.lastName !=
              null && (
                <>
                  <div>
                    Decision: {reqline.linelastDecision?.decision?.name ?? ""}
                    <Divider></Divider>
                    By:{" "}
                    {reqline.linelastDecision?.madebyuser?.firstName +
                      " " +
                      reqline.linelastDecision?.madebyuser?.lastName}
                    <Divider></Divider>
                    Decided On:{" "}
                    {reqline.linelastDecision?.decisiondatetime && (
                      <>
                        {customDateFormat(
                          reqline.linelastDecision?.decisiondatetime,
                          "Datetime",
                        )}
                      </>
                    )}
                    <Divider sx={{ borderTop: 3 }} />
                  </div>
                </>
              )}
            {reqline &&
              reqline.linelastreceivedDate &&
              reqline.linelastreceivedDate != null && (
                <>
                  <div>
                    Quantity Received: {reqline.linereceivedqty}
                    <Divider></Divider>
                    Received on:{" "}
                    {customDateFormat(reqline.linelastreceivedDate, "Datetime")}
                    <Divider sx={{ borderTop: 3 }} />
                  </div>
                </>
              )}
          </>
        }
        onMouseEnter={handleTooltipOpen}
      >
        <IconButton
          sx={{
            "&:hover": {
              background: theme.colors.primary.lighter,
            },
            color: theme.palette.primary.main,
          }}
          color="inherit"
          size="small"
        >
          <MoreRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>


    </>
  );
}

export default CustomProductInfoTooltip;
