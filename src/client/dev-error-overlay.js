if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
    const ReactRefreshErrorOverlay = require('@pmmmwh/react-refresh-webpack-plugin/overlay')
    ReactRefreshErrorOverlay.setEditorHandler(editorPath => {
      const [filePath, lineNumber, columnNumber] = editorPath.split(':')
      window.open(`vscode://file/${filePath}:${lineNumber}:${columnNumber}`)
    })
  }