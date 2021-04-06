import React from "react";
import config from "@config/config";
import styles from "./index.less";

const { contactContent } = config;

export default ({ style = {} }) => {
    return (
        <div className={styles.wrap} style={{ ...style }}>
            {contactContent}
        </div>
    );
};
