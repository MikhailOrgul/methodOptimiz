const f = ([x0, x1]) => x0**2 - 3*x0*x1 + 10*x1**2 + 5*x0 - 3*x1;

const constraints = [
    {
        g: ([x0, x1]) => x0+x1+1.5, // т.е. x0 + x1 ≤ 5
        type: "=="
    }
];

function hookeJeevesPenalty(
    f,                      // целевая функция
    x0,                     // начальная точка
    constraints = [],      // массив ограничений вида [{g: fn, type: '<=' | '==' }]
    lambda = 0.5,          // шаг
    alpha = 2,             // множитель образца
    eps = 1e-6,            // точность
    maxIter = 1000,        // максимум итераций
    penaltyCoeff = 10,     // начальный штрафной коэффициент A_k
    penaltyGrowth = 10,    // во сколько раз увеличивать A_k
    q = 2                  // степень штрафа
) {
    const directions = [
        [0, 1], [0, -1], [1, 0], [-1, 0],
        [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];

    const penalty = (x) => {
        let sum = 0;
        for (const { g, type } of constraints) {
            const gx = g(x);
            if (type === "<=") {
                sum += Math.pow(Math.max(0, gx), q);
            } else if (type === "==") {
                sum += Math.pow(Math.abs(gx), q); 
            }
        }
        return sum;
    };

    //
    const phi = (x, A) => f(x) + A * penalty(x); //Штрафная функция Лагранжа

    let A_k = penaltyCoeff;
    let xb = [...x0];
    let iter = 0;

    while (lambda >= eps && iter < maxIter) {
        iter++;
        let xStar = [...xb];
        let improved = false;

        // Исследующий поиск
        for (const [dx, dy] of directions) {
            const xTest = [xb[0] + dx * lambda, xb[1] + dy * lambda];
            if (phi(xTest, A_k) < phi(xStar, A_k)) {
                xStar = xTest;
                improved = true;
            }
        }

        if (!improved) {
            lambda /= 2;
            A_k *= penaltyGrowth;
            continue;
        }

        // Поиск по образцу
        const xNew = [
            xb[0] + alpha * (xStar[0] - xb[0]),
            xb[1] + alpha * (xStar[1] - xb[1])
        ];

        if (phi(xNew, A_k) < phi(xb, A_k)) {
            xb = xNew;
        } else {
            lambda /= 2;
            A_k *= penaltyGrowth;
        }
    }

    return {
        solution: xb,
        value: f(xb),
        penaltyValue: penalty(xb),
        iterations: iter,
        finalLambda: lambda,
        finalPenalty: A_k
    };
}


const result = hookeJeevesPenalty(f, [2, 1], constraints);

console.log(`    
    Минимум: ${result.solution};
    Значение f(x): ${result.value};
    Итераций: ${result.iterations};
    λ: ${result.finalLambda}
`)