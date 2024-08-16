"use server";

import { jwtVerify } from "jose";
import getToken from "./getToken";

type UserPayload = {
  id: string;
  email: string;
  name: string;
  linkedin: string;
  iat: number;
  exp: number;
};

const getServerUser = async (): Promise<null | UserPayload> => {
  const token = getToken();

  if (!token) {
    return null;
  }

  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET!)
  );

  return payload as UserPayload;
};

export default getServerUser;
