import Lex from "@lek-js/lex";
const Layout = ({children}) =>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>

    <link rel="preconnect" href="https://fonts.googleapis.com"/>
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
    <link href="https://fonts.googleapis.com/css2?family=Noto+Music&family=Raleway:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet"/>

    <style>{
    `
    .greek-note {
        font-family: "Noto Music", "Symbola", "Quivira", serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 20px;
        margin: 5px;
    }

    .long::before,
    .short::before {
        display: inline-block;   /* evita colapso */
        width: 0.6em;            /* mismo ancho para ambos; ajusta si quieres */
        text-align: center;      /* centra el "_" */
        line-height: 1em;        /* alineación consistente */
        vertical-align: baseline;
    }

    .long::before { content: "_"; }
    .short::before { content: "\\00a0"; } /* NBSP: espacio no colapsable */

    .music {
        display: flex;
        flex-direction: row;
    }

    .playing-note
    {
        background-color: rgba(0, 102, 255, 0.554);
    }
    .red-error
    {
        background-color: rgba(255, 0, 0, 0.55);
    }
    
    .piece, .piece-creator
    {
        border: solid black 2px;
        margin: 3vw;
        padding: 2vw;
    }
    `    
    }</style>

</head>
<body>
    {children}
</body>
</html>

export default Layout;