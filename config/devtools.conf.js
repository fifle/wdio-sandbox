const {config} = require('./wdio.conf');
const path = require('path');
const VisualRegressionCompare = require('wdio-novus-visual-regression-service/compare');

function getScreenshotName(basePath) {
    return function(context) {
        let type = context.type;
        let testName = context.test.title;
        let browserVersion = parseInt(context.browser.version, 10);
        let browserName = context.browser.name;
        let browserViewport = context.meta.viewport;
        let browserWidth = browserViewport.width;
        let browserHeight = browserViewport.height;

        return path.join(basePath, `${testName}_${type}_${browserName}_v${browserVersion}_${browserWidth}x${browserHeight}.png`);
    };
}

// Devtools configurations
config.reporters = [
    'spec',
    // ['allure', {
    //     outputDir: 'allure-results',
    //     disableWebdriverStepsReporting: false,
    //     disableWebdriverScreenshotsReporting: false,
    // }],
];

config.services = [['devtools'],
    ['eslinter',
        {
            runnerType: 'unresolved',
            eslintOverride: {
                "settings": {
                    "import/resolver": {
                        "eslint-import-resolver-custom-alias": {
                            "alias": {
                                "@helpers": "./test/helpers",
                                "@specs": "./test/specs",
                                "@pageobjects": "./test/pageobjects",
                                "@": "./"
                            }
                        }
                    }
                }
            }
        }],
    ['novus-visual-regression',
    {
        compare: new VisualRegressionCompare.LocalCompare({
            referenceName: getScreenshotName(path.join(process.cwd(), 'test/helpers/data/screenshots/reference')),
            screenshotName: getScreenshotName(path.join(process.cwd(), 'test/helpers/data/screenshots/screen')),
            diffName: getScreenshotName(path.join(process.cwd(), 'test/helpers/data/screenshots/diff')),
            misMatchTolerance: 0.01,
        }),
        viewportChangePause: 200,
        viewports: [{ width: 1024, height: 768 }],
        orientations: ['landscape'],
    }
    ]
];
config.capabilities = [{
    maxInstances: 1,
    browserName: 'chrome',
    acceptInsecureCerts: true,
}];

exports.config = config;