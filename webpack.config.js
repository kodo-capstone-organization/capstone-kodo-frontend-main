const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
    plugins: [
        new MonacoWebpackPlugin({
            // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
            languages: ['java', 'javascript', 'python'],
            features: ['bracketMatching', 'caretOperations',  'colorPicker', 'comment', 'clipboard', 'codeAction', 'codelens',
                'inlineCompletions', 'inspectTokens', 'linesOperations', 'linkedEditing', 'links',
                'multicursor', 'smartSelect', 'snippets', 'unusualLineTerminators', 'viewportSemanticTokens',
                'wordHighlighter']
        })
    ]
};