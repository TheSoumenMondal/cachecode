import {
  CalendarBlankIcon,
  CodeBlockIcon,
  GlobeIcon,
  LockKeyIcon,
  UserCircleIcon,
} from "@phosphor-icons/react/dist/ssr";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ActivityChart } from "@/components/features/activity-chart";
import { SignOutButton } from "@/components/features/sign-out-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/db/drizzle";
import { codeSnippet } from "@/db/schema";
import { auth } from "@/lib/auth";

const ProfilePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    redirect("/auth/login");
  }

  const { user } = session;

  const userSnippets = await db
    .select()
    .from(codeSnippet)
    .where(eq(codeSnippet.created_by, user.id));

  const totalSnippets = userSnippets.length;
  const publicSnippets = userSnippets.filter((s) => s.isPublic).length;
  const privateSnippets = totalSnippets - publicSnippets;

  const chartData = [];
  const today = new Date();

  for (let i = 14; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);

    const dateStr = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const count = userSnippets.filter((s) => {
      const sDate = new Date(s.createdAt);
      return (
        sDate.getFullYear() === d.getFullYear() &&
        sDate.getMonth() === d.getMonth() &&
        sDate.getDate() === d.getDate()
      );
    }).length;

    chartData.push({ date: dateStr, count });
  }

  const joinedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="w-full flex-1 p-2 flex justify-center">
      <div className="max-w-4xl w-full flex flex-col border">
        <div className="flex flex-col md:flex-row justify-between gap-6 px-2 py-4 items-center">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="size-24">
              <AvatarImage
                src={user.image || undefined}
                alt={user.name}
                className="rounded-none"
              />
              <AvatarFallback>
                <UserCircleIcon
                  className="size-12 text-muted-foreground"
                  weight="duotone"
                />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center md:items-start gap-2 mt-2">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="secondary"
                  className="font-mono text-[10px] uppercase tracking-wider rounded-none"
                >
                  User
                </Badge>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarBlankIcon className="size-3.5" weight="duotone" />
                  Joined {joinedDate}
                </div>
              </div>
            </div>
          </div>
          <div className="shrink-0 mt-4 md:mt-0">
            <SignOutButton />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3">
          <Card className="rounded-none">
            <CardHeader>
              <CardDescription className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold">
                <CodeBlockIcon
                  className="size-4 text-primary"
                  weight="duotone"
                />
                Total Snippets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-4xl">{totalSnippets}</CardTitle>
            </CardContent>
          </Card>

          <Card className="rounded-none border-border/50">
            <CardHeader>
              <CardDescription className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold">
                <GlobeIcon
                  className="size-4 text-emerald-500"
                  weight="duotone"
                />
                Public Snippets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-4xl">{publicSnippets}</CardTitle>
            </CardContent>
          </Card>

          <Card className="rounded-none border-border/50">
            <CardHeader>
              <CardDescription className="flex items-center gap-2 text-xs uppercase tracking-wider font-semibold">
                <LockKeyIcon
                  className="size-4 text-amber-500"
                  weight="duotone"
                />
                Private Snippets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-4xl">{privateSnippets}</CardTitle>
            </CardContent>
          </Card>
        </div>

        <ActivityChart data={chartData} />
      </div>
    </div>
  );
};

export default ProfilePage;
