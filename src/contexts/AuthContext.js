import React, { createContext, useEffect, useState } from "react";
import { sts, updateTokens } from "../aws";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [accessKey, setAccessKey] = useState();
  const [secretKey, setSecretKey] = useState();

  useEffect(() => {
    const accessKeyValue = localStorage.getItem('accessKey')
    const secretKeyValue = localStorage.getItem('secretKey')
    if (accessKeyValue && secretKeyValue) {
      verifyTokens(accessKeyValue, secretKeyValue)
    }
  }, [])

  const verifyTokens = (accessKeyValue, secretKeyValue) => {
    updateTokens(accessKeyValue, secretKeyValue)
    sts.getCallerIdentity({}, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        setAccessKey(accessKeyValue);
        setSecretKey(secretKeyValue);
        localStorage.setItem('accessKey', accessKeyValue)
        localStorage.setItem('secretKey', secretKeyValue)
      }
    });
  }

  const auth = (accessKeyValue, secretKeyValue) => {
    verifyTokens(accessKeyValue, secretKeyValue)
  };

  return <AuthContext.Provider value={{ accessKey, secretKey, auth }}>{children}</AuthContext.Provider>;
}
