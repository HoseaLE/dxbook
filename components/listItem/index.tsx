import styles from "./index.less";
import React, { ReactNode } from "react";
type Props = {
    title: ReactNode;
    description: ReactNode;
    style: { [key: string]: any };
};
export default function ListItem({ title, description, style = {} }: Props) {
    return (
        <div className={styles.item_wrap} style={style}>
            <h2 className={styles.title}>{title}</h2>
            <div className={styles.des}>{description}</div>
        </div>
    );
}
