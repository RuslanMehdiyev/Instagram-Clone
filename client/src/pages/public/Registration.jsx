import {
  Button,
  CssBaseline,
  TextField,
  Box,
  Grid,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerValidation } from "../../validations/validation";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { api } from "../../network/api";
import Copyright from "../../components/copyright/Copyright";
import { useState } from "react";

function Registration() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerValidation),
  });

  const navigate = useNavigate();

  const onSubmit = (data) => {
    if (data?.confirmPassword !== data?.password) {
      toast.error("Passwords didn't match!");
      return;
    }
    setLoading(true);
    api
      .add("/auth/register", {
        fullName: data.fullName,
        userName: data.userName,
        email: data.email,
        password: data.password,
      })
      .then((res) => {
        toast.success(res.message);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      })
      .finally(() => setLoading(false))
      .catch((err) => toast.error(err.response?.data.message));
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <ToastContainer />
      <Box
        sx={{
          marginTop: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" color={"primary"}>
          {"Welcome to Insta-Clone;)"}
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{ mt: 1 }}
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="fullName"
            label="Full Name"
            name="fullName"
            autoComplete="fullName"
            autoFocus
            {...register("fullName")}
            error={!!errors.fullName}
            helperText={errors.fullName?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="userName"
            label="User Name"
            name="userName"
            autoComplete="userName"
            {...register("userName")}
            error={!!errors.userName}
            helperText={errors.userName?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm password"
            type="password"
            autoComplete="current-password"
            {...register("confirmPassword")}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword?.message}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading && <CircularProgress size={15} />}
            {!loading && "Sign Up"}
          </Button>
          <Grid container>
            <Grid item xs>
              <Link to={"/"} variant="body2">
                Back to Login Page
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}

export default Registration;
