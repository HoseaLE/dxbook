import React, { ReactNode } from "react";
import styles from "./index.less";
import { BackTop } from "antd";
import { NextSeo } from "next-seo";

type Props = {
    children?: ReactNode;
    title?: string;
    seo?: any;
};
export default function Layout({ children, seo = {} }: Props) {
    return (
        <>
            <NextSeo {...seo} />
            <div className={styles.bg}></div>
            <div className={styles.main}>
                {children}
                <BackTop />
            </div>
        </>
    );
}
