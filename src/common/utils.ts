export function styleTagScoper(xhtml: string, imgtosvg?: boolean) {
  const scope = "scopescopescopescope";
  const styleTag = /<style>(\n|.)+?<\/style>/gim; // Matches style tags
  const atRule = /(?<=(@.+\s))\w+\s+(?={)/gim; // Matches css @rules
  const cssclass = /(?<=>|})\s*\.?[\w]+((?!%)(.|\n)?)+?(?=({|}))/gim; // Matches css classes
  const imgSelector = /(?<!\w)img(?!\w)/gim;
  const selector = /(?<=\.)[a-z]+/gi; // Matches css selectors
  const classDeclaration = /(?<=class=").+?(?=")/gi; // Matches element class declarations
  const className = /[\w-]+/gi; // Matches class names inside class declarations

  const scopedXhtml = xhtml
    .replace(styleTag, (tag) => {
      const atRuleNames = tag.match(atRule);
      // Adds scopes to the css selectors
      let scopedTag = tag.replace(cssclass, (cssclass) =>
        ` .${scope} ${cssclass.replace(
          selector,
          (selector) => `${scope}${selector}`,
        )}`.replace(/\s+/, " "),
      );
      // Replaces img selectors with svg selectors
      if (imgtosvg) scopedTag = scopedTag.replace(imgSelector, "svg");
      // Adds scopes to the @rules
      atRuleNames?.forEach((name) => {
        scopedTag = scopedTag.replace(new RegExp(name, "g"), `${scope}${name}`);
      });
      return scopedTag;
    })
    .replace(classDeclaration, (declaration) =>
      declaration.replace(className, (name) => `${scope}${name}`),
    );

  return { scopedXhtml, scope };
}
export function cssResetInjector(html: string): string {
  const reset = `<style>
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed, 
figure, figcaption, footer, header, hgroup, 
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
	margin: 0;
	padding: 0;
	border: 0;
	font-size: 100%;
	font: inherit;
	vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure, 
footer, header, hgroup, menu, nav, section {
	display: block;
}
body {
	line-height: 1;
}
ol, ul {
	list-style: none;
}
blockquote, q {
	quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
	content: '';
	content: none;
}
table {
	border-collapse: collapse;
	border-spacing: 0;
}
</style>
`;
  return reset + html;
}
export function commentRemover(xhtml: string) {
  const htmlComment = /<--(.|\n)*?-->/gim;
  const cssComment = /(\/\/.*?)|(\/\*.*?\*\/)/gim;
  return xhtml.replace(htmlComment, "").replace(cssComment, "");
}
export function scriptEscaper(xhtml: string) {
  const scriptTags = /<\/?script>/gim;
  return xhtml.replace(scriptTags, "");
}

export function stringToHex(str: string, int?: boolean) {
  const array = str.match(/./gi);
  if (!array) return null;
  const hexStr = array.reduce(
    (acc, curr) => acc + curr.charCodeAt(0).toString(16),
    "",
  );
  return int ? parseInt(hexStr) : hexStr;
}
export function proxyMsgRemover(str: string) {
  return str.replace(
    ` This API enables cross-origin requests to anywhere.

  Usage:
  
  /               Shows help
  /iscorsneeded   This is the only resource on this host which is served without CORS headers.
  /<url>          Create a request to <url>, and includes CORS headers in the response.
  
  If the protocol is omitted, it defaults to http (https if port 443 is specified).
  
  Cookies are disabled and stripped from requests.
  
  Redirects are automatically followed. For debugging purposes, each followed redirect results
  in the addition of a X-CORS-Redirect-n header, where n starts at 1. These headers are not
  accessible by the XMLHttpRequest API.
  After 5 redirects, redirects are not followed any more. The redirect response is sent back
  to the browser, which can choose to follow the redirect (handled automatically by the browser).
  
  The requested URL is available in the X-Request-URL response header.
  The final URL, after following all redirects, is available in the X-Final-URL response header.
  
  
  To prevent the use of the proxy for casual browsing, the API requires either the Origin
  or the X-Requested-With header to be set. To avoid unnecessary preflight (OPTIONS) requests,
  it's recommended to not manually set these headers in your code.
  
  
  Demo          :   https://robwu.nl/cors-anywhere.html
  Source code   :   https://github.com/Rob--W/cors-anywhere/
  Documentation :   https://github.com/Rob--W/cors-anywhere/#documentation`,
    "",
  );
}
export const CONSTANTS = {
  THIRTY_MINUTES: 1800,
  TWO_HOURS: 7200,
  FOUR_HOURS: 14400,
  ONE_DAY: 86400,
};
