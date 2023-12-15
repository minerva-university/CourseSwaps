import React from "react";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

const CopyRight = () => {
  return (
    <Typography variant="body2" color="#FFFFFF" align="center">
      {"Copyright © "}
      <Link
        color="inherit"
        href="https://my.minerva.edu/my-minerva/self-service/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Minerva University Registrar
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

// TODO: Find out how to import these icons
const socialLinks = [];

const SocialLinkItem = ({ item }) => (
  <Box
    component="li"
    sx={{
      display: "inline-block",
      color: "primary.contrastText",
      mr: 0.5,
    }}
  >
    sx={{
        lineHeight: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        borderRadius: "50%",
        color: "inherit",
        "&:hover": {
          backgroundColor: "secondary.main",
        },
        "& img": {
          fill: "currentColor",
          width: 22,
          height: "auto",
        },
      }}
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={item.link}
    >
      <img src={item.icon} alt={item.name + " icon"} />
    </a>
  </Box>
);

const SocialLinks = () => {
  return (
    <Box sx={{ ml: -1 }}>
      <ul>
        {socialLinks.map((item) => (
          <SocialLinkItem key={item.name} item={item} />
        ))}
      </ul>
    </Box>
  );
};

const FooterSectionTitle = ({ title }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        mb: 2,
      }}
    >
      <Typography
        component="p"
        variant="h5"
        sx={{ color: "primary.contrastText", fontWeight: "700" }}
      >
        {title}
      </Typography>
    </Box>
  );
};

const NavigationItem = ({ label, url, openInNewTab = true }) => {
  return (
    <MuiLink
      underline="hover"
      sx={{
        display: "block",
        mb: 1,
        color: "primary.contrastText",
      }}
      href={url}
      target={openInNewTab ? "_blank" : "_self"} // Conditionally set the target
      rel="noopener noreferrer" // Just for security
    >
      {label}
    </MuiLink>
  );
};

const LegalSectionItems = [
  {
    label: "Academic Policies",
    url: "https://www.minerva.edu/public/media/enrollment-center/Minerva-Student-Handbook_2015-2016.pdf",
  },
  {
    label: "Student Privacy",
    url: "https://my.minerva.edu/policies-guidelines/student-handbook/chapter-4-student-life/41-student-privacy-rights-and-responsibilities/",
  },
  {
    label: "Code of Conduct",
    url: "https://www.minerva.edu/public/media/enrollment-center/Minerva-Student-Handbook_2015-2016.pdf",
  },
];

const ServiceSectionItems = [
  {
    label: "Home",
    url: "/",
  },
  {
    label: "About Us",
    url: "/about-us",
    openInNewTab: false,
  },
  {
    label: "How to Swap Courses",
    url: "https://www.loom.com", // for the demo video
  },
  {
    label: "Contact Us",
    url: "mailto:registrar@minerva.edu",
  },
];

const ContactSectionItems = [
  {
    label: "14 Mint Plaza, San Francisco, CA 94103",
  },
];

const FooterNavigation = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <FooterSectionTitle title="Academic Information" />
        {LegalSectionItems.map(({ label, url }, index) => (
          <NavigationItem key={index + url} label={label} url={url} />
        ))}
      </Grid>
      <Grid item xs={12} md={4}>
        <FooterSectionTitle title="Useful Links" />
        {ServiceSectionItems.map(
          ({ label, url, openInNewTab = true }, index) => (
            <NavigationItem
              key={index + url}
              label={label}
              url={url}
              openInNewTab={openInNewTab}
            />
          )
        )}
      </Grid>
      <Grid item xs={12} md={4}>
        <FooterSectionTitle title="Contact Information" />
        {ContactSectionItems.map(({ label, path }, index) => (
          <NavigationItem key={index + path} label={label} url={path} />
        ))}
      </Grid>
    </Grid>
  );
};

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "black",
        py: { xs: 6, md: 10 },
        color: "white",
        fontFamily: "Poppins, sans-serif",
        bottom: 0,
        left: 0,
        width: "100%",
      }}
    >
      <Container>
        <Grid container spacing={1}>
          <Grid item xs={12} md={5}>
            <Box sx={{ width: { xs: "100%", md: 360 }, mb: { xs: 3, md: 0 } }}>
              <Typography
                component="h2"
                variant="h4"
                sx={{ mb: 2, fontSize: "2rem" }}
              >
                Minerva University Registrar
              </Typography>
              <Typography variant="subtitle1" sx={{ letterSpacing: 1, mb: 2 }}>
                <CopyRight />
              </Typography>
              <SocialLinks />
            </Box>
          </Grid>
          <Grid item xs={12} md={7}>
            <FooterNavigation />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
