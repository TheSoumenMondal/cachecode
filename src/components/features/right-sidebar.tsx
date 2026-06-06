import { headers } from "next/headers";
import { getAllTags, getUserTags } from "@/app/actions/snippet.actions";
import { auth } from "@/lib/auth";
import RightSidebarClient from "./right-sidebar-client";

const RightSidebar = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const allTags = await getAllTags();
  let userTags: string[] = [];

  if (session?.user) {
    userTags = await getUserTags(session.user.id);
  }

  return <RightSidebarClient allTags={allTags} userTags={userTags} />;
};

export default RightSidebar;
