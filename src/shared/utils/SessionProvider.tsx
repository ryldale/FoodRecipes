"use client";

import React, { ReactNode, useEffect, useState } from "react";
import {
  setCookie,
  getCookie,
  deleteCookie,
} from "@/shared/utils/cookie_handler";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  country: string;
}

interface SessionContextType {
  token: string | null;
  user: User | null;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  isLoading: boolean;
}

type PropType = {
  children: ReactNode;
};

const SessionContext = React.createContext<SessionContextType | undefined>(
  undefined
);

export const useSession = () => {
  const context = React.useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};

const SessionProvider = ({ children }: PropType) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = getCookie("authToken");
    const storedUser = getCookie("authUser");
    
    if (storedToken) {
      setTokenState(storedToken); 
    }

    if (storedUser) {
      setUserState(JSON.parse(storedUser)); 
    }

    setIsLoading(false);
  }, []);

  const handleSetToken = (newToken: string | null) => {
    setTokenState(newToken);
    if (newToken) {
      setCookie("authToken", newToken, 60 * 60 * 24);
    } else {
      deleteCookie("authToken");
    }
  };

  const handleSetUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      setCookie("authUser", JSON.stringify(newUser), 60 * 60 * 24);
    } else {
      deleteCookie("authUser");
    }
  };

  return (
    <SessionContext.Provider
      value={{
        token,
        user,
        setToken: handleSetToken,
        setUser: handleSetUser,
        isLoading,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
