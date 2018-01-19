const fs = require('fs');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const rxPaths = require('rxjs/_esm5/path-mapping');
const autoprefixer = require('autoprefixer');
const postcssUrl = require('postcss-url');
const cssnano = require('cssnano');
const postcssImports = require('postcss-import');

const { NoEmitOnErrorsPlugin, SourceMapDevToolPlugin, EnvironmentPlugin, HashedModuleIdsPlugin } = require('webpack');
const { BaseHrefWebpackPlugin, SuppressExtractedTextChunksWebpackPlugin } = require('@angular/cli/plugins/webpack');
const { CommonsChunkPlugin, ModuleConcatenationPlugin } = require('webpack').optimize;
const { LicenseWebpackPlugin } = require('license-webpack-plugin');
const { PurifyPlugin } = require('@angular-devkit/build-optimizer');
const { AngularCompilerPlugin } = require('@ngtools/webpack');

const nodeModules = path.join(process.cwd(), 'node_modules');
const realNodeModules = fs.realpathSync(nodeModules);
const genDirNodeModules = path.join(process.cwd(), 'tl24chat', '$$_gendir', 'node_modules');
const entryPoints = ["inline", "polyfills", "sw-register", "styles", "vendor", "main"];
const minimizeCss = true;
const baseHref = "";
const deployUrl = "";
const projectRoot = "C:\\Users\\it-su\\Projects\\Angular2\\global-angular";


module.exports = {
    "resolve": {
        "extensions": [
            ".ts",
            ".js"
        ],
        "modules": [
            "./node_modules",
            "./node_modules"
        ],
        "symlinks": true,
        "alias": rxPaths(),
        "mainFields": [
            "browser",
            "module",
            "main"
        ]
    },
    "resolveLoader": {
        "modules": [
            "./node_modules",
            "./node_modules"
        ],
        "alias": rxPaths()
    },
    "entry": {
        "main": [
            "./tl24chat\\main.ts"
        ],
        "polyfills": [
            "./tl24chat\\polyfills.ts"
        ]
    },
    "output": {
        "path": path.join(process.cwd(), "tl24chat/dist"),
        "filename": "[name].[chunkhash:20].bundle.js",
        "chunkFilename": "[id].[chunkhash:20].chunk.js",
        "crossOriginLoading": false
    },
    "module": {
        "rules": [
            {
                "test": /\.html$/,
                "loader": "raw-loader"
            },
            {
                "test": /\.(eot|svg|cur)$/,
                "loader": "file-loader",
                "options": {
                    "name": "[name].[hash:20].[ext]",
                    "limit": 10000
                }
            },
            {
                "test": /\.(jpg|png|webp|gif|otf|ttf|woff|woff2|ani)$/,
                "loader": "url-loader",
                "options": {
                    "name": "[name].[hash:20].[ext]",
                    "limit": 10000
                }
            },
            {
                "test": /\.js$/,
                "use": [
                    {
                        "loader": "@angular-devkit/build-optimizer/webpack-loader",
                        "options": {
                            "sourceMap": true
                        }
                    }
                ]
            },
            {
                test: /\.(css|scss)$/,

                "loaders": ExtractTextPlugin.extract({
                    use: [
                        'style-loader' ,'css-loader' ,'sass-loader'
                    ],
                    "publicPath": ""
                })
            },
            {
                "test": /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
                "use": [
                    {
                        "loader": "@angular-devkit/build-optimizer/webpack-loader",
                        "options": {
                            "sourceMap": true
                        }
                    },
                    "@ngtools/webpack"
                ]
            }
        ]
    },
    "plugins": [
        new NoEmitOnErrorsPlugin(),
        new CopyWebpackPlugin([
            {
                "context": "tl24chat",
                "to": "",
                "from": {
                    "glob": "C:\\Users\\it-su\\Projects\\Angular2\\global-angular\\tl24chat\\assets\\**\\*",
                    "dot": true
                }
            },
            {
                "context": "tl24chat",
                "to": "",
                "from": {
                    "glob": "C:\\Users\\it-su\\Projects\\Angular2\\global-angular\\tl24chat\\favicon.ico",
                    "dot": true
                }
            }
        ], {
            "ignore": [
                ".gitkeep",
                "**/.DS_Store",
                "**/Thumbs.db"
            ],
            "debug": "warning"
        }),
        new ProgressPlugin(),
        new CircularDependencyPlugin({
            "exclude": /(\\|\/)node_modules(\\|\/)/,
            "failOnError": false,
            "onDetected": false,
            "cwd": "C:\\Users\\it-su\\Projects\\Angular2\\global-angular"
        }),
        new HtmlWebpackPlugin({
            "template": "./tl24chat\\index.html",
            "filename": "./index.html",
            "hash": false,
            "inject": true,
            "compile": true,
            "favicon": false,
            "minify": {
                "caseSensitive": true,
                "collapseWhitespace": true,
                "keepClosingSlash": true
            },
            "cache": true,
            "showErrors": true,
            "chunks": "all",
            "excludeChunks": [],
            "title": "Webpack App",
            "xhtml": true,
            "chunksSortMode": function sort(left, right) {
                let leftIndex = entryPoints.indexOf(left.names[0]);
                let rightindex = entryPoints.indexOf(right.names[0]);
                if (leftIndex > rightindex) {
                    return 1;
                }
                else if (leftIndex < rightindex) {
                    return -1;
                }
                else {
                    return 0;
                }
            }
        }),
        new BaseHrefWebpackPlugin({}),
        new CommonsChunkPlugin({
            "name": [
                "inline"
            ],
            "minChunks": null
        }),
        new SourceMapDevToolPlugin({
            "filename": "[file].map[query]",
            "moduleFilenameTemplate": "[resource-path]",
            "fallbackModuleFilenameTemplate": "[resource-path]?[hash]",
            "sourceRoot": "webpack:///"
        }),
        new CommonsChunkPlugin({
            "name": [
                "main"
            ],
            "minChunks": 2,
            "async": "common"
        }),
        new ExtractTextPlugin({
            "filename": "[name].[contenthash:20].bundle.css"
        }),
        new SuppressExtractedTextChunksWebpackPlugin(),
        new EnvironmentPlugin({
            "NODE_ENV": "production"
        }),
        new HashedModuleIdsPlugin({
            "hashFunction": "md5",
            "hashDigest": "base64",
            "hashDigestLength": 4
        }),
        new ModuleConcatenationPlugin({}),
        new PurifyPlugin(),
        new UglifyJsPlugin({
            "test": /\.js$/i,
            "extractComments": false,
            "sourceMap": true,
            "cache": false,
            "parallel": false,
            "uglifyOptions": {
                "output": {
                    "ascii_only": true,
                    "comments": false,
                    "webkit": true
                },
                "ecma": 5,
                "warnings": false,
                "ie8": false,
                "mangle": {
                    "safari10": true
                },
                "compress": {
                    "typeofs": false,
                    "pure_getters": true,
                    "passes": 3
                }
            }
        }),
        new AngularCompilerPlugin({
            "mainPath": "main.ts",
            "platform": 0,
            "hostReplacementPaths": {
                "environments\\environment.ts": "environments\\environment.prod.ts"
            },
            "sourceMap": true,
            "tsConfigPath": "tl24chat\\tsconfig.app.json",
            "compilerOptions": {},
            "angularCompilerOptions": {
                "fullTemplateTypeCheck": true,
                skipTemplateCodegen: true
            }
        })
    ],
    "node": {
        "fs": "empty",
        "global": true,
        "crypto": "empty",
        "tls": "empty",
        "net": "empty",
        "process": true,
        "module": false,
        "clearImmediate": false,
        "setImmediate": false
    },
    "devServer": {
        "historyApiFallback": true
    }
};
