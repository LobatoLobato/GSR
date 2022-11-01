import { Monaco } from "@monaco-editor/react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

export function RegisterTagAutoClose(monaco: Monaco) {
  monaco.languages.registerCompletionItemProvider("html", {
    triggerCharacters: [">"],
    provideCompletionItems: (
      model: monaco.editor.ITextModel,
      position: monaco.Position,
    ) => {
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
            insertTextRules:
              monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
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
export function RegisterCustomTags(monaco: Monaco) {
  monaco.languages.registerCompletionItemProvider("html", {
    triggerCharacters: ["<"],
    provideCompletionItems: (
      model: monaco.editor.ITextModel,
      position: monaco.Position,
    ) => {
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
      let suggestions: monaco.languages.CompletionItem[] = [];
      for (const value of customTags) {
        suggestions.push({
          label: value,
          kind: monaco.languages.CompletionItemKind.EnumMember,
          insertText: value,
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
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
export function RegisterCustomAttributes(monaco: Monaco) {
  monaco.languages.registerCompletionItemProvider("html", {
    provideCompletionItems: (
      model: monaco.editor.ITextModel,
      position: monaco.Position,
    ) => {
      const customTags = ["size", "position", "name", "showOwner"];
      let suggestions: monaco.languages.CompletionItem[] = [];
      for (const value of customTags) {
        suggestions.push({
          label: value,
          kind: monaco.languages.CompletionItemKind.EnumMember,
          insertText: `${value}=""`,
          insertTextRules:
            monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
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
