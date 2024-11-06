import * as React from "react";
import { createContext, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { NavigateFunction, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "src/api/ApiSettings";
import {
  AuthContextType,
  IUser,
  JWTDeCode,
  systemRole,
  jobRole,
  strToBool,
} from "../models/mymodels";

import { changeUserPassword, refreshToken } from "../services/user.service";


const login = async (email: string, password: string) => {
  return axios
    .post(BASE_URL + "Auth/signin", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const initialState: AuthContextType = {
  checkUserLoggedIn: () => { },
  getCurrentUser: (): JSON | null => null,
  currentUser: null,
  error: undefined,
  login: login,
  logout: () => { },
  recoverPassword: () => { },
  register: function (email: string, password: string): void {
    throw new Error("Function not implemented.");
  },

  saveUser: function (userobj: IUser): void {
    throw new Error("Function not implemented.");
  },
  refreshUser: () => { },
  refreshSession: undefined,
  changePassword: undefined,
};
const UserContext = createContext<AuthContextType | null>(initialState);
export function useAuth() {
  return useContext(UserContext);
}

const PopulateUserFromJWT = (JWTtoken: any): IUser | null => {
  let theuser: IUser = {
    id: null,
    username: "",
    fullname: "",
    firstName: "",
    lastName: "",
    email: "",
    lockoutFlag: false,

    claimCanApproveRequest: false,
    claimCanMakeInventoryAdjustment: false,
    claimCanViewReports: false,
    claimCanMakePo: false,
    claimCanMakeRequest: false,
    claimCanReceiveItems: false,
    claimCanTransferStock: false,
    cconpurchaseOrder: false,
    roleId: 0,
    jobRoleId: 0,
    jobRole: { id: 0, roleName: "" },
    role: { id: 0, roleName: "" },
  };

  if (JWTtoken) {
    const decoded: JWTDeCode =
      jwtDecode<JWTDeCode>(JWTtoken.accessToken || "") || null;

    if (decoded) {
      const currentTime = Date.now() / 1000;
      // if (decoded?.exp < currentTime) {  //Object is possibly 'undefined'.
      if (decoded?.exp && decoded.exp < currentTime) {

        console.log("Token Expired!");
        return null;



      } else {
        theuser.id = decoded?.sub;
        theuser.email = decoded?.email;
        const sr: systemRole = {
          id: Number(decoded?.Systemroleid.toString()),
          roleName: decoded?.Systemrole,
        };
        const jr: jobRole = {
          id: Number(decoded?.Jobroleid.toString()),
          roleName: decoded?.Jobrole,
        };
        theuser.approverUid = decoded?.Approveruid;
        theuser.role = sr;
        theuser.jobRole = jr;

        theuser.username = decoded?.email;
        theuser.fullname = decoded?.name;
        theuser.firstName = decoded?.FirstName;
        theuser.lastName = decoded?.LastName;
        theuser.claimCanApproveRequest = strToBool(
          decoded?.ClaimCanApproveRequest.toString(),
        );
        theuser.claimCanViewReports = strToBool(
          decoded?.ClaimCanViewReports.toString(),
        );
        theuser.claimCanMakeInventoryAdjustment = strToBool(
          decoded?.ClaimCanMakeInventoryAdjustment.toString(),
        );
        theuser.claimCanMakePo = strToBool(decoded?.ClaimCanMakePo.toString());
        theuser.claimCanMakeRequest = strToBool(
          decoded?.ClaimCanMakeRequest.toString(),
        );
        theuser.claimCanReceiveItems = strToBool(
          decoded?.ClaimCanReceiveItems.toString(),
        );
        theuser.claimCanTransferStock = strToBool(
          decoded?.ClaimCanTransferStock.toString(),
        );
        theuser.cconpurchaseOrder = strToBool(
          decoded?.CConpurchaseOrder.toString(),
        );
        // console.log(theuser);
        return theuser;
      }
    }
  }


  console.log("Token Not readed!");
  return null;
};

export default function UserProvider({ children }: any) {
  let navigate: NavigateFunction = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;

  const refreshSession = async () => {
    return refreshToken()
      .then((response) => {
        if (response.status === 200) {
          if (response.data.accessToken) {
            localStorage.setItem("user", JSON.stringify(response.data));
            setcurrentUser(PopulateUserFromJWT(getCurrentUser()));
          }

          return response.data;
        } else {
          console.log(response.data, "Error updating user firstname!");
        }
      })
      .catch((error) => {
        console.log(error, "Error updating user firstname!");
      });
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ): Promise<any> => {
    try {
      const response = await changeUserPassword(currentPassword, newPassword);
      if (response.status === 200) {
        console.log(response.data);
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
          setcurrentUser(PopulateUserFromJWT(getCurrentUser()));
        }
        return { success: true, message: "Password changed successfully" };
      } else {
        console.log(response.data, "Error changing password!");
        let errorMessage: string;
        if (typeof response.data === "object") {
          errorMessage =
            response.data.message ||
            `Request failed with status code ${response.status}`;
        } else {
          errorMessage = response.data;
        }
        return {
          success: false,
          message: "Failed to change password. " + errorMessage,
        };
      }
    } catch (error: any) {
      console.log(error, "General Error updating password!");
      let errorMessage: string;
      if (error.response && error.response.data) {
        if (typeof error.response.data === "object") {
          errorMessage = error.response.data.message || "General Error!";
        } else {
          errorMessage = error.response.data;
        }
      } else {
        errorMessage = "General Error!";
      }
      return {
        success: false,
        message: "Failed to change password. " + errorMessage,
      };
    }
  };


  const refreshUser = async () => {


    if (!currentUser) {
      setcurrentUser(PopulateUserFromJWT(getCurrentUser()));
    }
  };

  const logout = async () => {

    setcurrentUser(null);

  };
  const getCurrentUser = (): JSON | null => {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);
    return null;
  };
  const [currentUser, setcurrentUser] = React.useState<IUser | null>(
    PopulateUserFromJWT(getCurrentUser()),
  );
  const [error, setError] = React.useState(null);


  React.useEffect(() => {

    if (!currentUser) {
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  }, [currentUser, navigate]);




  React.useEffect(() => {

    if (!PopulateUserFromJWT(getCurrentUser())) {

      logout();
    }

    // console.log(pathname);
  }, [pathname]);




  React.useEffect(() => {
    setInterval(() => {
      if (!PopulateUserFromJWT(getCurrentUser())) {
        logout();
      }
    }, 600000); // for testing only = 10 minutes
    //  console.log(useLocation().pathname);
  }, []);



  const register = async (email: string, password: string) => {
    //throw new Error('Function not implemented.');
  };



  const checkUserLoggedIn = async () => { };
  const recoverPassword = async (email: string) => {
    //throw new Error('Function not implemented.');
  };

  const saveUser = (userobj: IUser) => {
    const newUserhere: IUser = {
      //id: Math.random(),
      id: userobj.id,
      username: userobj.username,
      email: userobj.email,
      fullname: userobj.fullname,
      firstName: userobj.firstName,
      lastName: userobj.lastName,
      lockoutFlag: userobj.lockoutFlag,
      roleId: userobj.roleId,
      jobRoleId: userobj.jobRoleId,
      jobRole: userobj.jobRole,
      role: userobj.role,
      avatar: "",
      claimCanApproveRequest: userobj.claimCanApproveRequest,
      claimCanMakeInventoryAdjustment: userobj.claimCanMakeInventoryAdjustment,
      claimCanViewReports: userobj.claimCanViewReports,
      claimCanMakePo: userobj.claimCanMakePo,
      claimCanMakeRequest: userobj.claimCanMakeRequest,
      claimCanReceiveItems: userobj.claimCanReceiveItems,
      claimCanTransferStock: userobj.claimCanTransferStock,
      cconpurchaseOrder: userobj.cconpurchaseOrder,
    };
    setcurrentUser(newUserhere);
  };
  return (
    <UserContext.Provider
      value={{
        currentUser,
        error,
        register,
        login,
        logout,
        checkUserLoggedIn,
        saveUser,
        recoverPassword,
        getCurrentUser,
        refreshUser,
        refreshSession,
        changePassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );


}

