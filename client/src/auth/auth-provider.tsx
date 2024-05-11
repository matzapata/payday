import { KindeProvider } from '@kinde-oss/kinde-auth-react';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <KindeProvider
      // audience='' TODO:
      clientId={process.env.REACT_APP_KINDE_CLIENT_ID as string}
      domain={process.env.REACT_APP_KINDE_DOMAIN as string}
      logoutUri={window.location.origin}
      redirectUri={window.location.origin}
    >
      {children}
    </KindeProvider>
  );
}
