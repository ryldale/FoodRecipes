export const setCookie = (cname: string, cvalue: string, exdays: number): void => {
  let expires = "";

  if (exdays !== -1) {
    const d = new Date();

    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    expires = `expires=${d.toUTCString()}`;
  }

  document.cookie = `${cname}=${encodeURIComponent(
    cvalue
  )}; ${expires}; path=/; SameSite=Strict`;
};

export const getCookie = (cname: string | undefined): string | undefined => {
  if (!cname || typeof document === "undefined") {
    return undefined;
  }

  const name = `${cname}=`;
  const cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name)) {
      return decodeURIComponent(cookie.substring(name.length));
    }
  }

  return undefined;
};

export const deleteCookie = (cname: string): void => {
  document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
};

export const nukeCookies = (): void => {
  if (typeof document !== "undefined") {
    const cookies = document.cookie.split(";");

    cookies.forEach((cookie) => {
      const cookieName = cookie.split("=")[0].trim();
      if (cookieName) {
        deleteCookie(cookieName);
      }
    });
  }
};
