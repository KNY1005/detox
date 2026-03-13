import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase-proxy";
import { getLoginRedirectUrl } from "@/app/utils/auth/get-login-redirect-url";

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);

  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search;
  const currentPath = search ? `${pathname}${search}` : pathname;

  if (!user) {
    const loginUrl = new URL(getLoginRedirectUrl(currentPath), request.url);
    const redirectResponse = NextResponse.redirect(loginUrl);

    response.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie);
    });

    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: ["/community/new", "/community/:id/edit"],
};
