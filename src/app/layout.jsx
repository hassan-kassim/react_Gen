import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'React Gen',
  description: 'Sign in to your account',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
