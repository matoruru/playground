import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  PublicClientApplication,
  type AccountInfo,
  type AuthenticationResult,
} from "@azure/msal-browser";


const STORAGE_KEY = "msal-token-gen-config" as const;

type Config = Readonly<{
  tenantId: string;
  clientId: string;
  redirectUri: string;
  scopesText: string;
}>;

const defaultConfig: Config = {
  tenantId: "common",
  clientId: "",
  redirectUri: typeof window !== "undefined" ? window.location.origin : "http://localhost:3000",
  scopesText: "User.Read",
};

const parseScopes = (text: string): string[] =>
  (text || "")
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);

const safeJsonParse = <T,>(raw: string | null, fallback: T): T => {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const loadConfig = (): Config => {
  if (typeof window === "undefined") return defaultConfig;
  return { ...defaultConfig, ...safeJsonParse<Partial<Config>>(localStorage.getItem(STORAGE_KEY), {}) };
};

const saveConfig = (cfg: Config): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  } catch {
    void 0;
  }
};

const decodeJwt = (token?: string): unknown | null => {
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length < 2) return null;
  try {
    const payload = parts[1]?.replace(/-/g, "+").replace(/_/g, "/");
    if (!payload) return null;
    const json = decodeURIComponent(
      atob(payload)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const App = () => {
  const [cfg, setCfg] = useState<Config>(loadConfig);

  const authority = useMemo(
    () => `https://login.microsoftonline.com/${cfg.tenantId || "common"}`,
    [cfg.tenantId]
  );
  const scopes = useMemo(() => parseScopes(cfg.scopesText), [cfg.scopesText]);

  const [pca, setPca] = useState<PublicClientApplication | null>(null);
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [tokenResult, setTokenResult] = useState<AuthenticationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cfg.clientId || !cfg.redirectUri) {
      setPca(null);
      setAccount(null);
      return;
    }

    let disposed = false;
    const instance = new PublicClientApplication({
      auth: {
        clientId: cfg.clientId,
        authority,
        redirectUri: cfg.redirectUri,
        navigateToLoginRequestUrl: true,
      },
      cache: { cacheLocation: "localStorage", storeAuthStateInCookie: false },
    });

    (async () => {
      try {
        await instance.initialize();
        const res = await instance.handleRedirectPromise();
        const acc = res?.account || instance.getActiveAccount() || instance.getAllAccounts()[0] || null;
        if (!disposed) {
          if (acc) instance.setActiveAccount(acc);
          setAccount(acc);
          setPca(instance);
        }
      } catch (e: unknown) {
        if (e instanceof Error) {
          if (!disposed) setError(e.message);
        } else {
          if (!disposed) setError(String(e));
        }
      }
    })();

    return () => {
      disposed = true;
    };
  }, [cfg.clientId, cfg.redirectUri, authority]);

  useEffect(() => {
    saveConfig(cfg);
  }, [cfg]);

  const onInput = useCallback(
    (key: keyof Config) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setCfg((prev) => ({ ...prev, [key]: e.target.value })),
    []
  );

  const ensureInstance = (): void => {
    if (!pca) throw new Error("MSAL is not initialized. Enter Client ID and Redirect URI.");
  };

  const signIn = useCallback(
    async () => {
      try {
        ensureInstance();
        setError(null);
        setLoading(true);

        const loginRequest = { scopes: ["openid", "profile", "offline_access"] as string[] };
        await pca!.loginRedirect(loginRequest);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError(String(e));
        }
      } finally {
        setLoading(false);
      }
    },
    [pca]
  );

  const acquireToken = useCallback(async () => {
    try {
      ensureInstance();
      setError(null);
      setLoading(true);

      if (!account) throw new Error("No signed-in account. Sign in first.");
      if (!scopes.length) throw new Error("Enter at least one scope.");

      const req = { account, scopes, forceRefresh: true } as const;

      try {
        const silent = await pca!.acquireTokenSilent(req);
        setTokenResult(silent);
      } catch (err) {
        throw err as Error;
      }
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(String(e));
      }
    } finally {
      setLoading(false);
    }
  }, [pca, account, scopes]);

  const logout = useCallback(async () => {
    try {
      ensureInstance();
      setError(null);
      setLoading(true);
      const acc = pca!.getActiveAccount();
      await pca!.logoutPopup({ account: acc || undefined });
      setAccount(null);
      setTokenResult(null);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(String(e));
      }
    } finally {
      setLoading(false);
    }
  }, [pca]);

  const token = tokenResult?.accessToken || "";
  const claims = useMemo(() => decodeJwt(token), [token]);

  const tokenBoxRef = useRef<HTMLTextAreaElement | null>(null);
  const copyToken = async () => {
    try {
    if (!navigator.clipboard) {
    setError("Clipboard API is unavailable in this browser.");
    return;
    }
    await navigator.clipboard.writeText(token);
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError(String(e));
      }
    }
  };

  return (
    <div>
      <h1>Azure Access Token Generator</h1>

      <fieldset>
        <legend>Configuration</legend>
        <label>
          {`Tenant ID: `}
          <input
            placeholder="common or your-tenant-guid"
            value={cfg.tenantId}
            onChange={onInput("tenantId")}
          />
        </label>
        <br />
        <label>
          {`Client ID: `}
          <input
            placeholder="00000000-0000-0000-0000-000000000000"
            value={cfg.clientId}
            onChange={onInput("clientId")}
          />
        </label>
        <br />
        <label>
          {`Redirect URI: `}
          <input
            placeholder="https://your-app.example.com/auth/callback"
            value={cfg.redirectUri}
            onChange={onInput("redirectUri")}
          />
        </label>
        <br />
        <label>
          {`Scopes (comma or space separated): `}
          <input
            placeholder="User.Read  api://<app-id>/.default  https://graph.microsoft.com/User.Read"
            value={cfg.scopesText}
            onChange={onInput("scopesText")}
          />
        </label>
      </fieldset>

      <fieldset>
        <legend>Debug Info</legend>
        <label>Active account: {account?.username || "-"}</label><br />
        <label>Authority: <code>{authority}</code></label><br />
        <label>Requested scopes: <code>{scopes.join(" ") || "(not set)"}</code></label><br />
        <label>Client ID: <code>{cfg.clientId || "(not set)"}</code></label><br />
        <label>Redirect URI: <code>{cfg.redirectUri || "(not set)"}</code></label><br />
      </fieldset>

      {error && (
        <section>
          <h3>Error</h3>
          <pre>{error}</pre>
        </section>
      )}

      <section>
        <h2>Access Token</h2>
        <div>
          <button onClick={signIn} disabled={!pca || loading}>Sign in (Redirect)</button>
          <button onClick={acquireToken} disabled={!pca || !account || loading}>Acquire Token</button>
          <button onClick={logout} disabled={!pca || !account || loading}>Logout</button>
          <span> Status: {account ? `Signed in as ${account.username}` : "Not signed in"}</span>
        </div>
        <br />
        <div>Expires: {tokenResult?.expiresOn ? tokenResult.expiresOn.toLocaleString() : "-"}</div>
        <textarea ref={tokenBoxRef} readOnly value={token} rows={12} cols={100} />
        <div>
          <button onClick={copyToken} disabled={!token}>Copy</button>
          <span> </span>
          <a href={token ? `https://jwt.ms/#access_token=${encodeURIComponent(token)}` : undefined} target="_blank" rel="noreferrer">
            Open in jwt.ms
          </a>
        </div>
      </section>

      <section>
        <h2>Decoded Claims (payload)</h2>
        <pre>{claims ? JSON.stringify(claims, null, 2) : "Click 'Acquire Token' button to see decoded claims!"}</pre>
      </section>
    </div>
  );
}
