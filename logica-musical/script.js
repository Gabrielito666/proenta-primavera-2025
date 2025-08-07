const o = (x, y=1) => (x / Math.pow(2, y));
const od = (x, y=1) => Math.pow(2, y)* x;

const q = (x, y=1) => Math.pow((2/3), y) * x;
const qd = (x, y=1) => Math.pow((3/2), y) * x;

const c = (x) => (3*x)/4;


const x = 100;

const notas_en_bruto = [
    x,
    q(x),
    c(x),
    o(x),

    q(x, 2),
    q(x, 3),
    q(x, 4),
    q(x, 5)
];

console.log(notas_en_bruto);

const notas_entre_100_y_50 =
[
    x,
    q(x),
    c(x),
    o(x),

    od(q(x, 2)),
    od(q(x, 3)),
    od(q(x, 4), 2),
    od(q(x, 5), 2)
];

console.log(notas_entre_100_y_50);

const notas_ordenadas_entre_100_y_50 =
[
    notas_entre_100_y_50[0],
    notas_entre_100_y_50[4],
    notas_entre_100_y_50[6],
    notas_entre_100_y_50[2],
    notas_entre_100_y_50[1],
    notas_entre_100_y_50[5],
    notas_entre_100_y_50[7],
    notas_entre_100_y_50[3],
];
console.log(notas_ordenadas_entre_100_y_50);