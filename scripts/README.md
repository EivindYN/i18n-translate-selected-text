## Setup:
NB: Only works for Mac, can be configured to work for Windows (just hit me up)
* Add '/scripts' and its content to your project root 
  * If you add it somewhere else, you must update the path in the keybindings.json step
  * Edit the top variables in i18n-translate.ts to match your usage
* Inside your project:
  * ```npm i openai```
  * tsconfig.json -> 
  ```
  "compilerOptions": {
    "module": "commonjs",
  }
  ``````
* ```npm i ts-node -g``` (Necessary for running .ts files via terminal)
* Add to keybindings.json (ctrl+cmd+p, search 'Open Keyboard Shortcuts (JSON)')
```  {
    "key": "cmd+ctrl+t",
    "command": "runCommands",
    "args": {
      "commands": [
        "editor.action.clipboardCopyAction",
        {
          "command": "editor.action.insertSnippet",
          "args": {
            "snippet": "{t(`${TM_SELECTED_TEXT/ *\\n */ /gm}`)}"
          }
        },
        {
          "command": "workbench.action.terminal.sendSequence",
          "args": {
            "text": "\u000Dts-node '${workspaceFolder}'/scripts/i18n-translate.ts ${workspaceFolder}\u000D"
          }
        }
      ]
    },
    "when": "editorTextFocus"
  },
  ```

  Now whenever you select a text and press ctrl-cmd-t, it will cover the SELECTED_TEXT as {t('SELECTED_TEXT')} and add its translation to each locales/[locale]/common.json 