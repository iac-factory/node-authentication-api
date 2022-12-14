import OS from "os";

export default {
    // All imported modules in your tests should be mocked automatically
    automock: false,

    // Stop running tests after `n` failures
    bail: 0,

    // The directory where Jest should store its cached dependency information
    cacheDirectory: ".cache",

    // Automatically clear mock calls and instances between every test
    clearMocks: true,

    // Indicates whether the coverage information should be collected while executing the test
    collectCoverage: true,

    // An array of glob patterns indicating a set of files for which coverage information should be collected
    // collectCoverageFrom: undefined,

    // The directory where Jest should output its coverage files
    coverageDirectory: "coverage",

    // An array of regexp pattern strings used to skip coverage collection
    // coveragePathIgnorePatterns: [
    //     "$"
    // ],

    // Indicates which provider should be used to instrument code for coverage
    coverageProvider: "v8",

    // A list of reporter names that Jest uses when writing coverage reports
    coverageReporters: [
        "json",
        "text",
        "html",
        "lcov",
        "clover"
    ],

    // An object that configures minimum threshold enforcement for coverage results
    // coverageThreshold: undefined,

    // A path to a custom dependency extractor
    dependencyExtractor: undefined,

    // Make calling deprecated APIs throw helpful error messages
    errorOnDeprecated: true,

    // Force coverage collection from ignored files using an array of glob patterns
    forceCoverageMatch: [],

    // A path to a module which exports an async function that is triggered once before all test suites
    globalSetup: "<rootDir>/../setup.js",

    // A path to a module which exports an async function that is triggered once after all test suites
    globalTeardown: undefined,

    // A set of global variables that need to be available in all test environments
    // globals: {
    //     "ts-jest": {
    //         useESM: true
    //     }
    // },

    // The maximum amount of workers used to run your tests. Can be specified as % or a number. E.g. maxWorkers: 10% will use 10% of your CPU amount + 1 as the maximum worker number. maxWorkers: 2 will use a maximum of 2 workers.
    maxWorkers: /* OS.cpus().length, */ 1,

    // An array of directory names to be searched recursively up from the requiring module's location
    moduleDirectories: [
        "node_modules"
    ],

    // An array of file extensions your modules use
    // moduleFileExtensions: [ "js" ],

    // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.test.js": "$1"
    },
    // testRegex: "./(unit-testing/.*|(\\.|/)(test|spec))\\.js",
    testRegex: "test.js",
    testPathIgnorePatterns: [
        "(module)+(\\.|/)+(ts|js)",
        "(index)+(\\.|/)+(ts|js)",

        "(watcher)+(\\.|/)+(ts|js)",


        "(node_modules)+(\\.*)",
        "(unit-testing)+(\\.*)",
        "(__snapshots__/.*|(\\.|/)(test|spec))\\.js.snap"
    ],

    // An array of regexp pattern strings, matched against all module paths before considered 'visible' to the module loader
    modulePathIgnorePatterns: [],

    // Activates notifications for test results
    notify: false,

    // An enum that specifies notification mode. Requires { notify: true }
    notifyMode: "never",

    // Run tests from one or more projects
    projects: undefined,

    // Use this configuration option to add custom reporters to Jest
    reporters: undefined,

    // Automatically reset mock state between every test
    resetMocks: true,

    // Reset the module registry before running each individual test
    resetModules: true,

    // A path to a custom resolver
    resolver: undefined,

    // Automatically restore mock state between every test
    restoreMocks: false,

    // The root directory that Jest should scan for tests and modules within
    rootDir: "./packages",

    // A list of paths to directories that Jest should use to search for files in
    roots: [
        "<rootDir>"
    ],

    // Allows you to use a custom runner instead of Jest's default test runner
    runner: "jest-runner",

    // The paths to modules that run some code to configure or set up the testing environment before each test
    setupFiles: [
        "<rootDir>/../setup.js"
    ],

    // A list of paths to modules that run some code to configure or set up the testing framework before each test
    setupFilesAfterEnv: [
        "<rootDir>/../setup.js"
    ],

    // The number of seconds after which a test is considered as slow and reported as such in the results.
    slowTestThreshold: 15,

    // A list of paths to snapshot serializer modules Jest should use for snapshot testing
    snapshotSerializers: [],

    coveragePathIgnorePatterns: [
        "(node_modules)+(\\.*)",
        "(unit-testing)+(\\.*)",
        "(ci)+(\\.*)",
        "./(__snapshots__/.*|(\\.|/)(test|spec))\\.js.snap"
    ],

    // The test environment that will be used for testing
    testEnvironment: "node",

    // Options that will be passed to the testEnvironment
    testEnvironmentOptions: {},

    // Adds a location field to test results
    testLocationInResults: false,

    extensionsToTreatAsEsm: [ ".test.js" ],

    // This option allows the use of a custom results processor
    testResultsProcessor: undefined,

    // This option allows use of a custom test runner
    testRunner: undefined,

    // A map from regular expressions to paths to transformers
    transform: {},

    // Indicates whether each individual test should be reported during the run
    verbose: true,

    // An array of regexp patterns that are matched against all source file paths before re-running tests in watch mode
    watchPathIgnorePatterns: [],

    // Whether to use watchman for file crawling
    watchman: false
};
