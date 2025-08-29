const Fraction = require("fraction.js");

const MODES_NAMES = [ "DORICA", "FRIGIA", "LIDIA", "MIXOLIDIA", "HIPODORICA", "HIPOFRIGIA", "HIPOLIDIA"];

const TWO_OCTAVES_DORIC =
[
    new Fraction(1),
    new Fraction(8, 9),
    new Fraction(64, 81),
    new Fraction(3, 4),
    new Fraction(2, 3),
    new Fraction(16, 27),
    new Fraction(128, 243)
];
TWO_OCTAVES_DORIC.push(...TWO_OCTAVES_DORIC.map(f => f.div(2)), new Fraction(1, 4));

const FIRST_7_INTERVALS = TWO_OCTAVES_DORIC.slice(0, 7);    

const MODES_RATIOS = FIRST_7_INTERVALS.map(f => f.inverse());
const MODES_BASE = FIRST_7_INTERVALS.map((_, i) => TWO_OCTAVES_DORIC.slice(i, (i+8)));

const MODES = MODES_RATIOS.map((ratio, i) => MODES_BASE[i].map(f => f.mul(ratio)));

const MODES_TONES_SCHEMA = MODES.map((mode) =>
{
    return mode.slice(0, -1).map((f1, i) =>
    {
        const f2 = mode[i+1];
        return f2.div(f1);
    });
});


//PRINT AUX FUNCTION

const printSchema = (schema, tag="") =>
{
    const schemaStrings = schema.map(mode => mode.map(f => f.toFraction()));

    const numCols = Math.max(...schemaStrings.map(row => row.length));
    const colWidths = Array(numCols).fill(0).map((_, i) =>
    {
        return Math.max(...schemaStrings.map(row => (row[i] || "").length));
    });

    // Imprimimos alineado
    console.log("==================================");
    console.log(tag);
    console.log("==================================");
    schema.forEach((sh, i) => {
        const row = sh.map((f, c) => f.toFraction().padEnd(colWidths[c], " "));
        console.log(MODES_NAMES[i].padEnd(10), "==>", row.join("  "));
    });
    console.log("==================================");
    console.log("\n");

}


//IMPRIMIMOS

printSchema(MODES, "Proporciones de los Modos");
printSchema(MODES_TONES_SCHEMA, "Esquema de tonos y semitonos");