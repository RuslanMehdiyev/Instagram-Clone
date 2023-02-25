import { Link, Typography } from "@mui/material";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link
        color="inherit"
        target={"_blank"}
        href="https://www.linkedin.com/in/ruslan-mehdiyev/"
      >
        Ruslan Mehdiyev
      </Link>{" "}
      {new Date().getFullYear()}
    </Typography>
  );
}
export default Copyright;
