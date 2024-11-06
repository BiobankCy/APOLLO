import React, { useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { Alert } from "@mui/material";
import { AxiosError } from "axios";

import { useAuth } from "src/contexts/UserContext";

type Props = {};

const Login: React.FC<Props> = () => {
  let navigate: NavigateFunction = useNavigate();
  const userContext = useAuth();

  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");

    const { username, password } = formValues;
    if (username.length <= 3) {
      setMessage("Please enter a valid email address.");
      return;
    }

    if (password.length <= 0) {
      setMessage("Please enter your password.");
      return;
    }

    setMessage("");
    setLoading(true);

    try {
      await userContext?.login(username, password);
      userContext?.refreshUser();
      navigate("/home", { replace: true });
    } catch (error: any) {
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      setMessage(resMessage);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="form-group">
        <TextField
          size="medium"
          name="username"
          type="email"
          label="Email Address"
          value={formValues.username}
          onChange={handleInputChange}
          fullWidth
          required
          variant="outlined"
          margin="normal"
        />
      </div>

      <div className="form-group">
        <TextField
          size="medium"
          name="password"
          type="password"
          label="Password"
          required
          value={formValues.password}
          onChange={handleInputChange}
          fullWidth
          variant="outlined"
          margin="normal"
        />
      </div>

      <div className="form-group mt-3">
        <Button sx={{ m: 1 }} type="submit" variant="contained" disabled={loading}>
          <span>Login </span>
          {loading && (
            <span className="spinner-border spinner-border-sm"></span>
          )}
        </Button>
      </div>

      {message && (
        <div className="form-group mt-3">
          <Alert severity="error">{message}</Alert>
        </div>
      )}
    </form>
  );
};

export default Login;
