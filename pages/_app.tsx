import "../style.less";
import React, { JSXElementConstructor } from "react";
import Router from "next/router";
import NProgress from "nprogress";
import Head from "next/head";

Router.events.on("routeChangeStart", (url) => {
    console.log(`Loading: ${url}`);
    NProgress.start();
});
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

interface Props {
    Component: JSXElementConstructor<any>;
    pageProps: { [key: string]: any };
}
export default function MyApp({ Component, pageProps }: Props) {
    return (
        <>
            <Head>
                <link rel="stylesheet" type="text/css" href="/nprogress.css" />
            </Head>
            <Component {...pageProps} />
        </>
    );
}
