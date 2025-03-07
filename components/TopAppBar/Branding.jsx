// components/TopAppBar/Branding.jsx
import React from "react";
import Link from "next/link";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Image from "next/image";

const Branding = ({ branding, homeLink }) => {
  return (
    <Link href={homeLink} passHref legacyBehavior>
      <a
        style={{
          flexGrow: 1,
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          color: "inherit", // ensure the link inherits the color
        }}
      >
        <Box sx={{ mr: 1 }}>
          <Image
            src="/logo/android-chrome-192x192.png"
            alt="Logo"
            width={35}
            height={35}
          />
        </Box>
        <Typography variant="h6" component="span" sx={{ color: "inherit" }}>
          {branding}
        </Typography>
      </a>
    </Link>
  );
};

export default Branding;
