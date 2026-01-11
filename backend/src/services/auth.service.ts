import { auth } from "../lib/auth";
import { prisma } from "../../lib/prisma";
import type { RegisterInput, LoginInput } from "../types/auth.types";

export async function registerAndLoginUser(input: RegisterInput) {
  const { email, password, name } = input;

  let userId: string;

  // 1️⃣ Signup (idempotent)
  try {
    const signup = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: name || email.split("@")[0],
      },
    });
    userId = signup.user.id;
  } catch (err: any) {
    if (err?.body?.code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      if (!user) throw err;
      userId = user.id;
    } else {
      throw err;
    }
  }

  // 2️⃣ Ensure org + membership
  const { organization } = await prisma.$transaction(async (tx) => {
    const member = await tx.member.findFirst({
      where: { userId },
      include: { organization: true },
    });

    if (member) {
      return { organization: member.organization };
    }

    const organization = await tx.organization.create({
      data: {
        name: name ? `${name}'s Workspace` : `Workspace for ${email}`,
        slug: `${email.split("@")[0]}-${Date.now()}`,
      },
    });

    await tx.member.create({
      data: {
        userId,
        organizationId: organization.id,
        role: "admin",
      },
    });

    return { organization };
  });

  // 3️⃣ Login
  const loginRes = await auth.api.signInEmail({
    body: { email, password },
    asResponse: true,
  });

  const setCookie = loginRes.headers.get("set-cookie");
  if (!setCookie) {
    throw new Error("Failed to establish session");
  }

  // 4️⃣ Activate org
  await auth.api.setActiveOrganization({
    headers: { cookie: setCookie },
    body: { organizationId: organization.id },
  });

  return loginRes;
}

export async function loginUser(input: LoginInput) {
  const { email, password } = input;

  const loginRes = await auth.api.signInEmail({
    body: { email, password },
    asResponse: true,
  });

  const setCookie = loginRes.headers.get("set-cookie");
  if (!setCookie) {
    throw new Error("Session creation failed");
  }

  const session = await auth.api.getSession({
    headers: { cookie: setCookie },
  });

  if (!session) {
    throw new Error("Invalid session");
  }

  if (!session.session.activeOrganizationId) {
    const membership = await prisma.member.findFirst({
      where: { userId: session.user.id },
      orderBy: { id: "asc" },
      select: { organizationId: true },
    });

    if (!membership) {
      throw new Error("No organization membership found");
    }

    await auth.api.setActiveOrganization({
      headers: { cookie: setCookie },
      body: { organizationId: membership.organizationId },
    });
  }

  return loginRes;
}

export async function logoutUser(headers: Headers) {
  return auth.api.signOut({
    headers,
    asResponse: true,
  });
}
