// Вариант 4

let epsilon = 10 ** -6;
const phi = (1 + Math.sqrt(5)) / 2 - 1;

const functionValue = (x) => {
    return x ** 2 - 2 * x - 2 * Math.cos(x);
};

function fPrime(x) {
    return 2 * x - 2 + 2 * Math.sin(x);
}

function fDoublePrime(x) {
    return 2 + 2 * Math.cos(x);
}

const goldenSectionMethod = (a, b, epsilon) => {
    let x1 = b - phi * (b - a);
    let x2 = a + phi * (b - a);
    let k = 0
    while (Math.abs(b - a) > epsilon) {
        k++
        if (functionValue(x1) < functionValue(x2)) {
            b = x2;
        } else {
            a = x1;
        }
        x1 = b - phi * (b - a);
        x2 = a + phi * (b - a);
    }
    console.log(`\nМинимум найден на итерации ${k}`)
    return (a + b) / 2;
};

console.log(`Метод золотого сечения: x=${goldenSectionMethod(0.5, 1, epsilon)}\n`);

const newtonMethod = (xk, epsilon, maxIterations) => {
    for (let i = 0; i < maxIterations; i++) {
        if (Math.abs(fPrime(xk)) < epsilon) {
            console.log(`Минимум найден на итерации ${i + 1}`);
            break;
        }
        xk = xk - fPrime(xk) / fDoublePrime(xk);
        if (xk < 0.5) xk = 0.5;
        if (xk > 1) xk = 1;
    }
    return xk;
};

console.log(`Метод Ньютона: x=${newtonMethod(1, epsilon, 100)}\n`);

function tangentMethod(a, b, epsilon = 1e-6, maxIterations = 100) {
    let x_k = (a + b) / 2;
    let iterations = 0;
    while (iterations < maxIterations) {
        let df = fPrime(x_k);
        if (Math.abs(df) < epsilon) break;
        let x_next = x_k - fPrime(x_k) / fDoublePrime(x_k);
        if (x_next < a) x_next = (x_k + a) / 2; 
        if (x_next > b) x_next = (x_k + b) / 2;
        if (Math.abs(x_next - x_k) < epsilon)break;
        x_k = x_next;
        iterations++;
    }
    return `Минимум найден на итерации ${iterations}\nМетод касательных: x= ${x_k}`;
}

console.log(`${tangentMethod(0.5, 1, epsilon, 100)}\n`);