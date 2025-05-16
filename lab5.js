const M = 1e5;
const EPS = 1e-8;

const func = (x1, x2) => {
    return 2 * x1 + 2 * x2;
};

const variables = ['x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7'];
let baseIndexes = [6, 7, 4, 5];

let table = [

            //   x1   x2   x3   x4   x5   x6   x7   B
    /*x3*/    [ -3,  -2,   1,   0,   0,   0,   0,   6],     // -3x1 - 2x2 + x3 = 6
    /*x7*/    [  1,   1,   0,  -1,   0,   0,  -1,   3],     // x1 + x2 - x4 + x7 = 3
    /*x5*/    [  1,   0,   0,   0,   1,   0,   0,   3],     // x1 + x5 = 3
    /*x6*/    [  0,   1,   0,   0,   0,   1,   0,   5],     // x2 + x6 = 5
    /*f(x)*/  [-2 - M, -2 - M, 0, M, 0, 0, 0,  -3 * M] 
];

function findPivotColumn(zRow) {
    let min = 0, index = -1;
    for (let i = 0; i < zRow.length - 1; i++) {
        if (zRow[i] < min - EPS) {
            min = zRow[i];
            index = i;
        }
    }
    return index;
}

function findPivotRow(table, col) {
    let minRatio = Infinity;
    let pivotRow = -1;
    for (let i = 0; i < table.length - 1; i++) {
        const coeff = table[i][col];
        if (coeff > EPS) {
            const ratio = table[i][table[i].length - 1] / coeff;
            if (ratio < minRatio) {
                minRatio = ratio;
                pivotRow = i;
            }
        }
    }
    console.log(`Ведущая строка: ${pivotRow + 1}; Мин b/a=${minRatio}`);
    return pivotRow;
}

function pivot(table, pivotRow, pivotCol) {
    const pivotElement = table[pivotRow][pivotCol];
    table[pivotRow] = table[pivotRow].map(v => v / pivotElement);
    for (let i = 0; i < table.length; i++) {
        if (i !== pivotRow) {
            const factor = table[i][pivotCol];
            for (let j = 0; j < table[i].length; j++) {
                table[i][j] -= factor * table[pivotRow][j];
            }
        }
    }
}

function simplexSolve() {
    let iterations = 0;
    while (iterations < 3) {
        const pivotCol = findPivotColumn(table[table.length - 1]);
        if (pivotCol === -1) break;

        const pivotRow = findPivotRow(table, pivotCol);
        if (pivotRow === -1) {
            console.log('Unbounded solution');
            return;
        }

        pivot(table, pivotRow, pivotCol);
        baseIndexes[pivotRow] = pivotCol;

        iterations++;
        if (iterations > 100) {
            console.log('Too many iterations');
            break;
        }
    }

    let result = {};
    for (let i = 0; i < variables.length; i++) result[variables[i]] = 0;

    for (let i = 0; i < baseIndexes.length; i++) {
        const varIndex = baseIndexes[i];
        result[variables[varIndex]] = table[i][table[i].length - 1];
        console.log(table[i][table[i].length - 1]);
    }

    console.log('Result:');
    console.table({x1: result.x1, x2: result.x2});
    console.log(`F = ${func(result['x1'], result['x2'])}`);
}

simplexSolve();
