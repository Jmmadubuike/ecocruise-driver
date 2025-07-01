import "../globals.css";
import { AuthProvider } from "@/context/AuthContext";
import ToastProvider from "@/components/providers/ToastProvider";
import SidebarNav from "@/components/driver/SidebarNav";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <ToastProvider />
          <div className="flex flex-1 flex-col sm:flex-row">
            <SidebarNav />
            <div className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
              <main className="w-full">{children}</main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
