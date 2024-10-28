import { getServerSession } from "next-auth";
import { NavMenu } from "./components/nav";
import "./globals.css";
import { Providers } from "./providers";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { authOptions } from "./api/auth/[...nextauth]/route";

export const metadata = {
  title: "DMS",
  description: "DMS",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className="block w-full max-w-screen-lg px-4 py-2 mx-auto">
        <AppRouterCacheProvider>
          <Providers>
            {session && <NavMenu />}
            {children}
          </Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
