/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

const less = require('less');
const path = require('path');
const fs = require('fs-extra');
const rimraf = require('rimraf');

const CleanCSS = require('clean-css');
const RewriteImportPlugin = require("less-plugin-rewrite-import");
const NpmImportPlugin = require('less-plugin-npm-import');

const libDir = path.join(__dirname, '..', 'lib');
const buildDir = path.join(__dirname, '..', 'build');
const themesDir = path.join(__dirname, '..', 'src', 'themes');

const lessNpmModuleDir = path.dirname(require.resolve('less'));
const semanticUILessModuleDir = path.join(lessNpmModuleDir, '..', '..', '..', 'semantic-ui-less@2.5.0', 'node_modules', 'semantic-ui-less');

const generateThemes = () => {
    const themes = fs.readdirSync(themesDir);

    let fileWritePromises = themes.map(theme => {
        const filePath = path.join(themesDir, theme, 'index.less');

        if (!fs.existsSync(filePath)) {
            return;
        }

        const options = {
            ieCompat: true,
            compress: false,
            sourceMap: true,
            javascriptEnabled: true,
            filename: path.resolve(filePath),
            plugins: [
                new NpmImportPlugin({ prefix: '~' }),
                new RewriteImportPlugin({
                    paths: {
                        "../../theme.config": path.join(themesDir, theme, 'semantic-ui.config'),
                        "../../ballerina.config": path.join(themesDir, theme, 'ballerina.config')
                    }
                })
            ]
        };

        const src = fs.readFileSync(filePath, 'utf8');

        return less.render(src, options).then(function (output) {
            const minifiedOutput = new CleanCSS().minify(output.css);
            const files = {
                '.css': output.css,
                '.css.map': output.map,
                '.min.css': minifiedOutput.styles
            };

            Object.keys(files).map(key => writeFile(theme, key, files[key]));
        }, (error) => {
            console.error(error);
        });
    });

    Promise.all(fileWritePromises).then(function (buffers) {
        copyFiles();
    }).catch(function (error) {
        console.error(error);
    });
};

const writeFile = (theme, file, content) => {
    fs.writeFileSync(path.join(buildDir, "ballerina-" + theme + file), content, (error) => {
        console.error("ballerina-" + theme + file + " generation failed.");
        console.error(error);
    });

    console.info("ballerina-" + theme + file + " generated.");
};

const copyFiles = () => {
    if (!fs.existsSync(libDir)) {
        fs.mkdirSync(libDir);
        copyCSS();
    } else {
        rimraf(libDir + '/*', () => {
            copyCSS();
        });
    }
};

const copyCSS = () => {
    fs.copy(buildDir, libDir)
        .then(() => {
            console.info('generated css files copied.');
            copyAssets();
        })
        .catch((error) => {
            console.error(error);
        });
};

const copyAssets = () => {
    fs.copy(path.join(semanticUILessModuleDir, 'themes', 'default', 'assets'), path.join(libDir, 'assets'))
        .then(() => {
            console.info('semantic-ui-less assets copied.');
            fs.removeSync(buildDir);
            console.info('Done.');
        })
        .catch((error) => {
            console.error(error);
        });
};

if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
    generateThemes();
} else {
    rimraf(buildDir + '/*', () => {
        generateThemes();
    });
}
