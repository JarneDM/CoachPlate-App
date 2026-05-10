import { createContext, useContext, useState } from "react";

type UserType = "coach" | "client";
type UserTypeContextValue = [UserType, (type: UserType) => void];

export const UserTypeContext = createContext<UserTypeContextValue>(["coach", () => {}]);

export function useUserType() {
  return useContext(UserTypeContext);
}
