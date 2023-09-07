import { Monaco } from "@monaco-editor/react";
import { editor, languages, Position } from "monaco-editor";
import { loader } from "@monaco-editor/react";
import { themes as MonacoThemes } from "@web/assets/themes";

function RegisterTagAutoClose(monaco: Monaco) {
  monaco.languages.registerCompletionItemProvider("html", {
    triggerCharacters: [">"],
    provideCompletionItems: (model: editor.ITextModel, position: Position) => {
      const codePre: string = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });

      const tag = codePre.match(/(?<=<)\w+/);

      if (!tag) {
        return;
      }

      const word = model.getWordUntilPosition(position);

      return {
        suggestions: [
          {
            label: `</${tag}>`,
            kind: monaco.languages.CompletionItemKind.EnumMember,
            insertText: `$1</${tag}>`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: word.startColumn,
              endColumn: word.endColumn,
            },
          },
        ],
      };
    },
  });
}
function RegisterCustomTags(monaco: Monaco) {
  monaco.languages.registerCompletionItemProvider("html", {
    triggerCharacters: ["<"],
    provideCompletionItems: (model: editor.ITextModel, position: Position) => {
      const customTags = [
        "gitstats",
        "statpullrequests",
        "statcommits",
        "statcontributedto",
        "statstarsearned",
        "statissues",
        "gitstreak",
        "streakcontributionscount",
        "streakcontributionsfirstdate",
        "streakcurrentcount",
        "streakcurrentstartdate",
        "streakcurrentenddate",
        "streaklongestcount",
        "streaklongeststartdate",
        "streaklongestenddate",
        "gittoplangs",
        "lang",
        "langName",
        "langPercentage",
        "gitrepo",
        "reponame",
        "repodescription",
        "repolanguage",
        "repostarcount",
        "repoforkcount",
      ];
      const suggestions: languages.CompletionItem[] = [];
      const word = model.getWordUntilPosition(position);
      for (const value of customTags) {
        suggestions.push({
          label: value,
          kind: monaco.languages.CompletionItemKind.EnumMember,
          insertText: value,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn,
          },
        });
      }
      return {
        suggestions,
      };
    },
  });
}
function RegisterCustomAttributes(monaco: Monaco) {
  monaco.languages.registerCompletionItemProvider("html", {
    provideCompletionItems: (_: editor.ITextModel, position: Position) => {
      const customTags = ["size", "position", "name", "showOwner", "percentSymbol"];
      const suggestions: languages.CompletionItem[] = [];
      for (const value of customTags) {
        suggestions.push({
          label: value,
          kind: monaco.languages.CompletionItemKind.EnumMember,
          insertText: `${value}=""`,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: 0,
            endColumn: position.column,
          },
        });
      }
      return {
        suggestions,
      };
    },
  });
}

loader.init().then((monaco) => {
  for (const key in MonacoThemes) {
    monaco.editor.defineTheme(key, MonacoThemes[key]);
  }
  RegisterTagAutoClose(monaco);
  RegisterCustomAttributes(monaco);
  RegisterCustomTags(monaco);
  // new monaco.Token().
  // monaco.editor.registerCommand()
  // monaco.languages.html.htmlDefaults.options.format?.indentInnerHtml
  // monaco.languages.registerDocumentFormattingEditProvider("html", {
  //   provideDocumentFormattingEdits
  // })
});
