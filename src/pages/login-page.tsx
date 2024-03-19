import {
  Alert,
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import axios from "../api/axios";
import { useNavigate } from "react-router-dom";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(50),
});

type Inputs = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Inputs>({ resolver: zodResolver(schema) });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await axios.post("/auth/login", data);
      const { accessToken } = response.data;
      localStorage.setItem("token", accessToken);
      navigate("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          setError("root", { message: "Invalid email or password" });
        }
        return;
      }
      setError("root", { message: "Some error occured" });
    }
  };

  return (
    <Box
      onSubmit={handleSubmit(onSubmit)}
      component={"form"}
      border={1}
      borderColor={(theme) => theme.palette.grey[300]}
      boxShadow={3}
      maxWidth={350}
      marginX={"auto"}
      paddingY={5}
      paddingX={2}
      borderRadius={1}
      autoComplete="off"
    >
      <Typography
        variant="h5"
        component="h1"
        textAlign={"center"}
        mb={5}
        fontWeight={600}
        color={(theme) => theme.palette.grey[800]}
      >
        Login
      </Typography>
      {errors.root && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.root?.message}
        </Alert>
      )}

      <Stack spacing={2} textAlign={"center"}>
        <Box>
          <TextField
            error={Boolean(errors.email)}
            id="outlined-error-helper-text"
            label="Email"
            helperText={errors.email?.message}
            // placeholder="Email"
            fullWidth
            autoFocus
            {...register("email")}
          />
        </Box>
        <Box>
          <FormControl variant="outlined" fullWidth>
            <InputLabel
              htmlFor="outlined-adornment-password"
              error={Boolean(errors?.password)}
            >
              Password
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
              error={Boolean(errors?.password)}
              {...register("password")}
            />
            <FormHelperText error={Boolean(errors?.password)}>
              {errors?.password?.message}
            </FormHelperText>
          </FormControl>
        </Box>
        <Box>
          <Button variant="contained" fullWidth size="large" type="submit">
            Login
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
