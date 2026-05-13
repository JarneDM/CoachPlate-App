import { createContext, Dispatch, SetStateAction } from "react";

type UserType = "coach" | "client";

export const UserTypeContext = createContext<{ userType: UserType; setUserType: Dispatch<SetStateAction<UserType>> }>({
  userType: "coach",
  setUserType: () => {},
});
