import type { Product } from "../types";
import type { AuthResult, Catalog, GearList, Trip, TripItem, User } from "./types";

/** A failed API call. `errors` holds Laravel's per-field validation messages. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly errors: Record<string, string[]> = {},
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export type ApiClientOptions = {
  /** e.g. "https://basecampoutfitters.com". Empty for same-origin calls from the website. */
  baseUrl: string;
  /** The app's bearer token. The website omits this and uses its session cookie instead. */
  getToken?: () => string | null | undefined;
  /** Called on a 401, e.g. to sign the app out when its token was revoked. */
  onUnauthorized?: () => void;
};

/** Typed calls to the Laravel API (routes/api.php), shared by the website and the app. */
export function createApiClient({ baseUrl, getToken, onUnauthorized }: ApiClientOptions) {
  const root = `${baseUrl.replace(/\/$/, "")}/api/v1`;

  async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const headers: Record<string, string> = { Accept: "application/json", "X-Requested-With": "XMLHttpRequest" };
    if (body !== undefined) headers["Content-Type"] = "application/json";
    // The app sends its token; the website (no getToken) sends its session cookie and CSRF token.
    const usesCookies = !getToken;
    const token = getToken?.();
    if (token) headers.Authorization = `Bearer ${token}`;
    const xsrf = usesCookies && typeof document !== "undefined" ? readCookie("XSRF-TOKEN") : null;
    if (xsrf) headers["X-XSRF-TOKEN"] = xsrf;

    let response: Response;
    try {
      response = await fetch(`${root}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        credentials: usesCookies ? "same-origin" : "omit",
      });
    } catch {
      throw new ApiError("Can't reach the server. Check your connection and try again.", 0);
    }

    if (response.status === 204) return undefined as T;
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      if (response.status === 401) onUnauthorized?.();
      const errors: Record<string, string[]> = data.errors ?? {};
      const first = Object.values(errors)[0]?.[0];
      throw new ApiError(first ?? data.message ?? "Something went wrong. Try again.", response.status, errors);
    }
    return data as T;
  }

  const enc = encodeURIComponent;

  return {
    // Catalog
    fetchCatalog: () => request<Catalog>("GET", "/catalog"),
    fetchProduct: (slug: string) => request<Product>("GET", `/products/${enc(slug)}`),
    search: (q: string) => request<Product[]>("GET", `/search?q=${enc(q)}`),

    // Accounts (token sign-in for the app)
    register: (email: string, password: string, deviceName?: string) =>
      request<AuthResult>("POST", "/auth/register", { email, password, device_name: deviceName }),
    login: (email: string, password: string, deviceName?: string) =>
      request<AuthResult>("POST", "/auth/login", { email, password, device_name: deviceName }),
    forgotPassword: (email: string) => request<{ message: string }>("POST", "/auth/forgot-password", { email }),
    /** Swaps the one-time code from an Apple / Google sign-in for a token. */
    exchangeCode: (code: string, deviceName?: string) =>
      request<AuthResult>("POST", "/auth/exchange", { code, device_name: deviceName }),
    logout: () => request<void>("POST", "/auth/logout"),
    fetchMe: () => request<{ user: User }>("GET", "/me").then((r) => r.user),
    /** Permanently deletes the account and all saved lists and trips. */
    deleteAccount: () => request<void>("DELETE", "/me"),

    // Gear lists
    /** All of the signed-in user's lists, Favorites first, then oldest to newest. */
    fetchLists: () => request<GearList[]>("GET", "/lists"),
    createList: (name: string, productId?: string) => request<GearList>("POST", "/lists", { name, productId }),
    renameList: (id: string, name: string) => request<GearList>("PATCH", `/lists/${id}`, { name }),
    /** Favorites can't be deleted. */
    deleteList: (id: string) => request<void>("DELETE", `/lists/${id}`),
    setProductInList: (listId: string, productId: string, saved: boolean) =>
      request<void>(saved ? "PUT" : "DELETE", `/lists/${listId}/products/${enc(productId)}`),

    // Trips
    /** The signed-in user's trips, newest first. */
    fetchTrips: () => request<Trip[]>("GET", "/trips"),
    fetchTrip: (id: string) => request<Trip>("GET", `/trips/${id}`),
    /** Creates a trip, copying the template's items if one is given. */
    createTrip: (name: string, templateId?: string) => request<Trip>("POST", "/trips", { name, templateId }),
    deleteTrip: (id: string) => request<void>("DELETE", `/trips/${id}`),
    setItemChecked: (itemId: string, checked: boolean) =>
      request<TripItem>("PATCH", `/trip-items/${itemId}`, { checked }),
    /** Adds a custom item at the end of the trip's checklist. */
    addItem: (tripId: string, label: string) => request<TripItem>("POST", `/trips/${tripId}/items`, { label }),
    removeItem: (itemId: string) => request<void>("DELETE", `/trip-items/${itemId}`),
    /** Undoes `removeItem`; the item returns to its original section and position. */
    restoreItem: (itemId: string) => request<TripItem>("POST", `/trip-items/${itemId}/restore`),
  };
}

export type ApiClient = ReturnType<typeof createApiClient>;

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}
