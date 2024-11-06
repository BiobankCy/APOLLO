import React, { useState } from "react";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ExpandLess from "@mui/icons-material/ExpandLess";

interface ExpandableRowCellProps {
  reqline: {
    linepname: string;
    linePrimers?: any[];  
    linesequenceidentifier?: string;
    linenucleotideSequence?: string;
    
  };
  onToggleExpansion: () => void;
}

const ExpandableRowCell: React.FC<ExpandableRowCellProps> = ({
  reqline,
  onToggleExpansion,
}) => {
  const [expandPrimerList, setExpandPrimerList] = useState(false);

  return (
    <TableCell>
      <>
        <Stack direction="row" spacing={2}>
          <Typography
            variant="body1"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
          >
            {reqline.linepname}
          </Typography>
          {(reqline.linePrimers?.length ?? 0) > 0 ||
          (reqline.linesequenceidentifier?.length ?? 0) > 0 ? (
            <IconButton
              onClick={() => {
                setExpandPrimerList(!expandPrimerList);
                onToggleExpansion(); // Notify the parent component about the expansion state change
              }}
              style={{ cursor: "pointer" }}
            >
              {expandPrimerList ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          ) : null}
        </Stack>

        {expandPrimerList && (
          <>
           
          </>
        )}
      </>
    </TableCell>
  );
};

export default ExpandableRowCell;
