const buildHtml = require("@lek-js/lex/build-html");
const path = require("path");

const paths =
{
    layout: path.resolve(process.cwd(), "layout.jsx"),
    page: path.resolve(process.cwd(), "page.jsx"),
    output: path.resolve(process.cwd(), "index.html"),
}

buildHtml.layout(paths.layout, paths.page, {
    outfile: paths.output,
    write: true,
    minify: false
}).then(() =>
{
    console.log("build!");
});