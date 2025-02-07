import React, { PropsWithChildren, useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import supabase from "@/utils/supabase";

type AuthContextType = {
  session: Session | null;
  user: Session["user"] | null;
  isAuthenticated: boolean;
  loading: boolean; // Add loading to AuthContextType
};

const AuthContext = React.createContext<AuthContextType>({
  session: null,
  user: null,
  isAuthenticated: false,
  loading: true, // Initialize loading state
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false); // Set loading to false once session is obtained
      setIsReady(true);
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user || null,
        isAuthenticated: !!session?.user,
        loading, // Include loading in the context provider
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => React.useContext(AuthContext);
