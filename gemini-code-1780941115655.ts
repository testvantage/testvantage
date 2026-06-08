import '@/app/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'TestVantage | Your Advantage In Every Exam',
  description: 'High-performance online mock exam platform for SSC, Railway, Banking, UPSC, and State Exams.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-slate-50 text-slate-900 antialiased font-sans min-h-screen flex flex-col justify-between">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <footer className="bg-slate-900 text-white py-8 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 text-center sm:flex sm:justify-between sm:text-left">
              <p>&copy; 2026 TestVantage. Your Advantage In Every Exam.</p>
              <div className="mt-4 sm:mt-0 space-x-4 text-slate-400">
                <a href="#" className="hover:text-orange-500 transition">Terms</a>
                <a href="#" className="hover:text-orange-500 transition">Privacy Policy</a>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}