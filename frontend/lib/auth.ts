import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function authenticatedFetch(
    url: string,
    options: RequestInit = {},
    router: AppRouterInstance
) {
    const response = await fetch(url, {
        ...options,
        credentials: "include",
    });

    if (response.status === 401) {
        router.push("/login");
        throw new Error("Unauthorized");
    }

    return response;
}

export async function checkAuth(
    router: AppRouterInstance
) {
    try {
        const response = await fetch(
            `${BASE_URL}/api/auth/me/`,
            {
                credentials: "include",
            }
        );

        if (response.status === 401) {
            router.push("/login");
            return null;
        }

        if (!response.ok) {
            router.push("/login");
            return null;
        }

        const user = await response.json();
        return user;
    } catch (error) {
        router.push("/login");
        return null;
    }
}