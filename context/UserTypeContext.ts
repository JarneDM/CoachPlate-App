import { createContext, Dispatch, SetStateAction } from "react";

type UserType = "coach" | "client";

export const UserTypeContext = createContext<[UserType, Dispatch<SetStateAction<UserType>>]>([
  "coach",
  () => {},
]);
