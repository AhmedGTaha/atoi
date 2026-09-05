"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { loginSchema } from "@/lib/validation/auth";
import { authenticateAdmin } from "@/lib/services/adminAuthService";
import { createAdminSession, destroyAdminSession } from "@/lib/auth/session";
import { rateLimit, clientIpFrom } from "@/lib/utils/rateLimit";

export interface AdminLoginState {
  error?: string;
}

export async function loginAdminAction(
  _prevState: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const headerList = await headers();
  const ip = clientIpFrom(headerList);
  const limit = rateLimit(`admin-login:${ip}`, { limit: 10, windowMs: 10 * 60 * 1000 });
  if (!limit.allowed) {
    return { error: "Too many attempts. Please try again in a few minutes." };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  const admin = await authenticateAdmin(parsed.data.email, parsed.data.password);
  if (!admin) {
    return { error: "Incorrect email or password." };
  }

  await createAdminSession({
    role: "admin",
    adminId: admin.id,
    email: admin.email,
    name: admin.name,
  });

  redirect("/admin");
}

export async function logoutAdminAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}
