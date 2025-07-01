import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import ToastProvider from "@/components/providers/ToastProvider";
import Navbar from "@/components/driver/Navbar";
import Footer from "@/components/driver/Footer";

export default function DriverRootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col min-h-screen bg-base-100">
        <AuthProvider>
          <ToastProvider />
          
          {/* Sticky Navbar on top */}
          <Navbar />

          {/* Main content area */}
          <div className="flex-1 w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <main className="w-full">{children}</main>
          </div>

          {/* Sticky footer */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
