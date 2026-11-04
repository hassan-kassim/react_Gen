import './globals.css';
import { Toaster } from 'react-hot-toast';
import AppShell from './app-shell';
import { ReduxProvider } from '../state/providers';

export const metadata = {
  title: 'React Gen',
  description: 'Sign in to your account',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppShell>
          <ReduxProvider> {children} </ReduxProvider>
        </AppShell>
        <Toaster />
      </body>
    </html>
  );
}
