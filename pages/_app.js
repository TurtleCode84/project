import { SWRConfig } from "swr";
import fetchJson from "lib/fetchJson";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { useEffect } from "react";

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const currentTheme = localStorage.getItem("theme");
    if (currentTheme) {
      document.documentElement.setAttribute("data-theme", currentTheme);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  }, [])

  useEffect(() => {
    if("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("/notifications.js").then(
          (registration) =>
          registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey,
          })     
        );
      });
    } else {
      console.log("Service Workers are not supported");
    }
  }, [])

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey="6LdBzhUiAAAAAGnjMtWaqrFmFAG6gE_yM_LQq_tZ"
      scriptProps={{
        async: false,
        defer: false,
        appendTo: "head",
        nonce: undefined,
      }}
    >
    <SWRConfig
      value={{
        fetcher: fetchJson,
        onError: (err) => {
          console.error(err);
        },
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
    </GoogleReCaptchaProvider>
  );
}

export default MyApp;
