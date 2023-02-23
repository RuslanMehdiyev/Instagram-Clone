import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../network/api";
import { authContext } from "../../store/AuthContext";

function ConfirmCode() {
  let location = useLocation();

  const navigate = useNavigate();
  const { loginStatus, setLoginStatus } = useContext(authContext);
  const [confirmCode, setConfirmCode] = useState("");

  console.log(location.state);

  const confirm = () => {
    api
      .add("/auth/confirm", {
        confirmCode: confirmCode,
        userId: location.state.userId,
      })
      .then((res) => {
        console.log(res);
        localStorage.setItem("token", `${res.token}`);
        setLoginStatus(true);
      })
      .catch((err) => {
        alert("Confirm Code Error!!");
      });
  };
  return (
    <>
      <input type="text" onChange={(e) => setConfirmCode(e.target.value)} />
      <button onClick={confirm}>Confirm</button>
    </>
  );
}

export default ConfirmCode;
