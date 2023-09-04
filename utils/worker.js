const { runAsWorker } = require('synckit');

// Default Prettier code style, to ensure same code style across all projects.
const DEFAULT_PRETTIER_CONFIG = {
    // Disables annoying issue, when people with Windows and Linux environments are working
    //   on same project. Linux has only LF at the end of line, while Windows has CRLF. This
    //   results in dirty git history. In my opinion, best strategy is to turn off "core.autocrlf"
    //   on Windows and commit "as is".
    endOfLine: 'auto',
    tabWidth: 4,
    printWidth: 120,
    trailingComma: 'all',
    singleQuote: true,
    useTabs: false,
    arrowParens: 'always',
    bracketSameLine: false,
    bracketSpacing: true,
    embeddedLanguageFormatting: 'auto',
    jsxSingleQuote: false,
};

runAsWorker(async () => {
    let prettierConfig = DEFAULT_PRETTIER_CONFIG;

    try {
        prettierConfig = await require('prettier').resolveConfig(process.cwd());
    } catch {
        console.warn('Cannot find prettier configuration file - fallback to defaults');
    }

    return prettierConfig;
});
