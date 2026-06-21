import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { SessionProvider } from "@/providers/SessionProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <ReactQueryProvider>
            <Navbar />

            {children}

            <Footer />
          </ReactQueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
