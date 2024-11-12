import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

 const Copyright =(props) => {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://www.cpm-int.com/">
        CPM India
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
export default Copyright;
