import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { getServerSession } from "@/lib/getServerSession";

export default async function RootLayout({ children }) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <Navbar user={session?.user} />

          {children}

          <Footer />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
