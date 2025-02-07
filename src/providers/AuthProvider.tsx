import React, { PropsWithChildren } from "react";
import { Session } from "@supabase/supabase-js";
import supabase from "@/utils/supabase";

type AuthContextType = {
  session: Session | null;
  user: Session["user"] | null;
  isAuthenticated: boolean;
};

const AuthContext = React.createContext<AuthContextType>({
  session: null,
  user: null,
  isAuthenticated: false,
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsReady(true);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user || null,
        isAuthenticated: !!session?.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => React.useContext(AuthContext);
