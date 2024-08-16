"use server";

import { cookies } from "next/headers";

const getToken = () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return null;
  }

  return token;
};

export default getToken;
