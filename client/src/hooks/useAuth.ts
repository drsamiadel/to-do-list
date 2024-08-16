"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "@/lib/redux/features/authSlice";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";

export function useAuth() {
  const dispatch = useDispatch();

  useEffect(() => {
    const authToken = Cookies.get("token");

    if (authToken) {
      const decoded = jwt.decode(authToken) as jwt.JwtPayload;
      dispatch(
        login({
          user: {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
          },
          token: authToken,
        })
      );
    }
  }, [dispatch]);
}
