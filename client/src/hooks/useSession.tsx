import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../types";
import { api } from "../services/api";

const Ctx = createContext<{
  user: User | null;
  loading: boolean;
  login: (name: string, password: string) => Promise<void>;
  refresh: () => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}>({
  user: null,
  loading: true,
  login: async () => {},
  refresh: async () => {},
  setUser: () => {}
});

export function SessionProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    const id = localStorage.getItem("neon-user");

    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setUser(await api.user(id));
    } catch {
      localStorage.removeItem("neon-user");
      setUser(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const login = async (name: string, password: string) => {
    const u = await api.login(name, password);

    localStorage.setItem("neon-user", u.id);
    setUser(u);
  };

  return (
    <Ctx.Provider
      value={{
        user,
        loading,
        login,
        refresh,
        setUser
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export const useSession = () => useContext(Ctx);
