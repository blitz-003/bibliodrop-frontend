import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReactQueryProvider from "@/providers/ReactQueryProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <Navbar />

          {children}

          <Footer />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
