import "../styles/Home.module.css";
import "../styles/globals.css";
import "../styles/pdfs.css";

import '@fortawesome/fontawesome-svg-core/styles.css'

// import '../assets/font/SegoeUI.ttf'
import Script from "next/script";
import Head from "next/head";
import { wrapper, store } from "../src/store/configStore";
import sessionstorage from "sessionstorage";

import { Provider } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { useEffect } from "react";
import Router from "next/router";
import { UpdatedOfferLetterView } from "../src/constants/constants";


function MyApp({ Component, pageProps }) {

  const [user, setUser] = useState(null);
  const [authorized, setAuthorized] = useState(false);

  //  authentication
  useEffect(() => {
    // on initial load - run auth check
    authCheck(Router.asPath);

    // on route change start - hide page content by setting authorized to false
    const hideContent = () => setAuthorized(false);
    Router.events.on("routeChangeStart", hideContent);

    // on route change complete - run auth check
    Router.events.on("routeChangeComplete", authCheck);

    // unsubscribe from events in useEffect return function
    return () => {
      Router.events.off("routeChangeStart", hideContent);
      Router.events.off("routeChangeComplete", authCheck);
    };
    console.log("data", )

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function authCheck(url) {
    const tokens = sessionStorage.getItem("UserDetails");
    // redirect to login page if accessing a private page and not logged in
    setUser(tokens);
    const publicPaths = ["/", "/"];
    const path =url&& url.split("?")[0];
    console.log("path----",path, url)
    // https://hrm1.cpmindia.com/OfferLetters/
    
    if (!url.includes(UpdatedOfferLetterView) && !tokens && !publicPaths.includes(path)) {
      setAuthorized(false);
        Router.push({
        pathname: "/",
        query: { returnUrl: Router.asPath },
      });
    } else {
      setAuthorized(true);
    }
  }

  return (
    <>{authorized && 
    <Provider store={store}>
      <Component {...pageProps} />
      <Script
        id="bootstrap-cdn"
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"
      />
      <script src="js/jquery.js" />
      <script src="js/main.js"></script>
    </Provider>
    }
</>
  );
}

export default wrapper.withRedux(MyApp);
