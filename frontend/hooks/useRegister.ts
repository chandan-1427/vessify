import { useState } from "react";
import { registerUser } from "@/lib/api/auth";

export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function register(email: string, password: string) {
    setLoading(true);
    setError(null);

    try {
      await registerUser({ email, password });
      return true;
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
      return false;
    } finally {
      setLoading(false);
    }
  }

  return {
    register,
    loading,
    error,
  };
}
