import "../style.less";
import React, { JSXElementConstructor } from "react";
interface Props {
    Component: JSXElementConstructor<any>;
    pageProps: { [key: string]: any };
}
export default function MyApp({ Component, pageProps }: Props) {
    return <Component {...pageProps} />;
}
