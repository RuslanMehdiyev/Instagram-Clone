import {
  Button,
  CssBaseline,
  TextField,
  Paper,
  Box,
  Grid,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Link } from "react-router-dom";
import Icon from "../../assets/images/instaicon.png";
import { loginValidation } from "../../validations/validation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import { api } from "../../network/api";
import Copyright from "../../components/copyright/Copyright";
import { useContext, useState } from "react";
import { authContext } from "../../context/AuthContext";

export default function Login() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginValidation),
  });
  const { setCurrentUser } = useContext(authContext);

  const navigate = useNavigate();

  const onSubmit = (data) => {
    setLoading(true);
    api
      .add("/auth/login", data)
      .then((res) => {
        localStorage.setItem("user", JSON.stringify(res));
        setCurrentUser(JSON.parse(localStorage.getItem("user")));
        navigate("confirm", { state: { userId: res._id } });
      })
      .finally(() => setLoading(false))
      .catch((err) => {
        console.log("Err", err);
        toast.error(err.response?.data.message);
      });
  };

  return (
    <Box width={{ xs: "100%", sm: "90%", md: "80%" }} margin="0 auto">
      <Grid
        container
        component="main"
        sx={{ height: "100vh" }}
        pt="3rem"
        borderRadius={"1rem"}
      >
        <CssBaseline />
        <ToastContainer />
        <Grid
          height={"90%"}
          item
          xs={false}
          sm={6}
          md={7}
          sx={{
            backgroundImage: "url(https://source.unsplash.com/random)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid
          height={"90%"}
          item
          xs={12}
          sm={6}
          md={5}
          component={Paper}
          elevation={6}
          square
        >
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <img src={Icon} alt="" style={{ width: "50px" }} />
            <Typography component="h1" variant="h5">
              Instagram-Clone
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                {loading && <CircularProgress size={15} />}
                {!loading && "Sign In"}
              </Button>
              <Grid container>
                <Grid item>
                  <Link to={"/register"}>
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
