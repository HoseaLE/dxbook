const path = require("path");
const fs = require("fs");
const lessToJS = require("less-vars-to-js");
const withLess = require("@zeit/next-less");
const cssLoaderGetLocalIdent = require("css-loader/lib/getLocalIdent.js");

const themeVariables = lessToJS(
    fs.readFileSync(path.resolve(__dirname, "./antd-custom.less"), "utf8")
);

// 别名
const alias = {
    "@utils": path.resolve(__dirname, "utils"),
    "@config": path.resolve(__dirname, "config"),
    "@pages": path.resolve(__dirname, "pages"),
    "@components": path.resolve(__dirname, "components"),
};

module.exports = withLess({
    cssModules: true,
    lessLoaderOptions: {
        javascriptEnabled: true,
        modifyVars: themeVariables, // make your antd custom effective
    },
    cssLoaderOptions: {
        importLoaders: 1,
        localIdentName: "[local]___[hash:base64:5]",
        getLocalIdent: (context, localIdentName, localName, options) => {
            let hz = context.resourcePath.replace(context.rootContext, "");
            if (/node_modules/.test(hz)) {
                return localName;
            } else {
                return cssLoaderGetLocalIdent(
                    context,
                    localIdentName,
                    localName,
                    options
                );
            }
        },
    },
    webpack: function (config, { isServer }) {
        if (isServer) {
            const antStyles = /antd\/.*?\/style.*?/;
            const origExternals = [...config.externals];
            config.externals = [
                (context, request, callback) => {
                    if (request.match(antStyles)) return callback();
                    if (typeof origExternals[0] === "function") {
                        origExternals[0](context, request, callback);
                    } else {
                        callback();
                    }
                },
                ...(typeof origExternals[0] === "function"
                    ? []
                    : origExternals),
            ];

            config.module.rules.unshift({
                test: antStyles,
                use: "null-loader",
            });
        }
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            ...alias,
        };
        return config;
    },
});
