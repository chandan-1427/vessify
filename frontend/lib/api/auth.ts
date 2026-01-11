export type RegisterPayload = {
  email: string;
  password: string;
};

export async function registerUser(payload: RegisterPayload) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    }
  );

  if (!res.ok) {
    let message = "Registration failed";

    try {
      const data = await res.json();
      message = data?.error || message;
    } catch {
      // ignore JSON parse errors
    }

    throw new Error(message);
  }

  return res.json();
}
