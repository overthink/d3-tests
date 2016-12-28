module.exports = {
    entry: "./src/index.ts",
    output: {
        filename: "./dist/bundle.js"
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' as resolvable extensions.
        extensions: ["", ".ts", ".js"]
    },

    module: {
        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, loader: "source-map-loader" }
        ],

        loaders: [
            // All files with a '.ts' extension will be handled by 'ts-loader'.
            { test: /\.ts$/, loader: "ts-loader" }
        ]
    },

    externals: [
        // Don't bundle giant dependencies, instead assume they're available in the html doc as global variables
        // node module name -> JS global through which it is available
        {"d3": "d3",
         "immutable": "Immutable"}
    ]

};
