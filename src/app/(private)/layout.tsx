import { getSessionUserId } from "@/lib/get-session-user-id";
import { redirect } from "next/navigation";
import React, { ReactElement } from "react";

interface PrivateLayoutProps {
  children: ReactElement<{ userId: string }>
}

const PrivateLayout = async ({ children }: PrivateLayoutProps) => {
  const userId = await getSessionUserId();

  if (!userId) {
    redirect("/authentication");
  }

  return React.isValidElement(children) && React.cloneElement(children, { userId });
};

export default PrivateLayout;
