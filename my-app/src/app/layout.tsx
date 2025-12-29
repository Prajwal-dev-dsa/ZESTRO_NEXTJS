import type { Metadata } from "next";
import "./globals.css";
import Provider from "@/Provider";
import StoreProvider from "@/redux/StoreProvider";
import InitalizeUser from "@/InitalizeUser";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Zestro - Groceries. Delivered. Done.",
  description: "Groceries. Delivered. Done.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="w-full min-h-screen bg-linear-to-b from-sky-100 to-white">
        <Provider>
          <StoreProvider>
            <InitalizeUser />
            {/* Toaster is using for temporary needs, will remove it later */}
            <Toaster />
            {children}
          </StoreProvider>
        </Provider>
      </body>
    </html>
  );
}