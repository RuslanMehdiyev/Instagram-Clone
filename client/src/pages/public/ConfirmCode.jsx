import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../network/api";
import { authContext } from "../../context/AuthContext";
import { Box, Button, Container, TextField, Typography } from "@mui/material";

function ConfirmCode() {
  let location = useLocation();

  const { setLoginStatus } = useContext(authContext);
  const [confirmCode, setConfirmCode] = useState("");

  const confirm = (e) => {
    e.preventDefault();
    api
      .add("/auth/confirm", {
        confirmCode: confirmCode,
        userId: location.state.userId,
      })
      .then((res) => {
        localStorage.setItem("token", `${res.token}`);
        setLoginStatus(true);
      })
      .catch((err) => {
        alert("Confirm Code Error!!");
      });
  };
  return (
    <>
      <Container
        component="main"
        maxWidth="xs"
        style={{ margin: "120px auto" }}
      >
        <Box
          component="form"
          onSubmit={confirm}
          sx={{
            boxShadow: "0px 0px 10px 0px darkblue",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignContent: "center",
            width: "100%",
            height: "60vh",
            padding: "0 36px",
            borderRadius: "15px",
          }}
        >
          <Typography
            component="h1"
            variant="h5"
            textAlign={"center"}
            fontWeight={"bold"}
            color="primary"
            fontSize={"2rem"}
          >
            Confirmation
          </Typography>
          <Typography>
            Confirm code was sended to your email, please verify.
          </Typography>
          <TextField
            autoFocus
            margin="normal"
            autoComplete="password"
            label="Confirm code"
            variant="outlined"
            fullWidth
            onChange={(e) => setConfirmCode(e.target.value)}
          />
          <Button
            type="submit"
            size="small"
            variant="contained"
            sx={{ mt: 3, mb: 2, p: 2 }}
          >
            Submit
          </Button>
        </Box>
      </Container>
    </>
  );
}

export default ConfirmCode;
