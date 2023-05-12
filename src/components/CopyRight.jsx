import React from 'react'

import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

const CopyRight = (props) => {
  return (
    <div>
      <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://google.com/">
        Mano Industries
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
    </div>
  )
}

export default CopyRight
