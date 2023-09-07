export default function html() {
  return {
    name: "vite3-plugin-html-import",
    transform(code: string, id: string): { code: string } {
      const cwd = process.cwd().replace(/\\/g, "/");
      const isHtml = /^.*\.html$/g.test(id);
      const isEntryHtml = id === `${cwd}/index.html`;

      if (isHtml && !isEntryHtml) {
        code = `export default \`${code}\``;
      }
      return { code };
    },
  };
}
