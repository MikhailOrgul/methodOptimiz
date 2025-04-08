function hookeJeeves8Directions(f, x0, lambda = 0.5, alpha = 2, eps = 1e-6, maxIter = 1000) {
    let xb = [...x0];  // Базовая точка
    let n = x0.length; // Размерность (должна быть 2 для 8-точечного поиска)
    let iter = 0;

    // Все 8 возможных направлений для 2D случая
    const directions = [
        [0, 1], [0, -1], [1, 0], [-1, 0],  // Ось X и Y
        [1, 1], [1, -1], [-1, 1], [-1, -1]  // Диагонали
    ];

    while (lambda >= eps && iter < maxIter) {
        iter++;
        let xStar = [...xb];
        let improved = false;

        // 1. Исследующий поиск по всем 8 направлениям
        for (const [dx, dy] of directions) {
            const xTest = [xb[0] + dx * lambda, xb[1] + dy * lambda];
            if (f(xTest) < f(xStar)) {
                xStar = xTest;
                improved = true;
            }
        }

        // 2. Если улучшений нет → уменьшаем lambda
        if (!improved) {
            lambda /= 2;
            continue;
        }

        // 3. Поиск по образцу
        const xNew = [
            xb[0] + alpha * (xStar[0] - xb[0]),
            xb[1] + alpha * (xStar[1] - xb[1])
        ];

        if (f(xNew) < f(xb)) {
            xb = xNew;  // Принимаем новую точку
        } else {
            lambda /= 2;  // Уменьшаем шаг
        }
    }

    return {
        solution: xb,
        value: f(xb),
        iterations: iter,
        finalLambda: lambda
    };
}

// Пример использования
const f = (x) => x[0]**2 - 3*x[0]*x[1] + 10*x[1]**2 + 5*x[0] - 3*x[1];
const result = hookeJeeves8Directions(f, [2, 1]);


console.log("Минимум:", result.solution, "\n", 
    "Итераций:", result.iterations, "\n", 
    "Значение функции:", result.value
);