const eps = 10 ** -6;

// function func(x) {
//     return x ** 2 - 2 * x - 2 * Math.cos(x);
// }

// function diffFunc(x) {
//     return 2 * x - 2 + 2 * Math.sin(x);
// }

function func(x) {
    const [x1, x2] = x;
    return x1 ** 2 - 3 * x1 * x2 + 10 * x2 ** 2 + 5 * x1 - 3 * x2;
}

function diffFunc(x) {
    const [x1, x2] = x;
    const df_dx1 = 2 * x1 - 3 * x2 + 5;
    const df_dx2 = -3 * x1 + 20 * x2 - 3;
    return [df_dx1, df_dx2]; // Return both partial derivatives
}

function gradientMethodWithFixedStep() {
    let x = [1, 1]; // Starting point as an array [x1, x2]
    let xPrev = [0, 0]; 
    let step0 = 0.1; 
    let i = 0; 
    
    while (Math.abs(func(x) - func(xPrev)) > eps) {
        xPrev = [...x]; // Copy the current x to xPrev
        
        // Update both x1 and x2 using gradient descent
        const gradient = diffFunc(x);
        x[0] = x[0] - step0 * gradient[0];
        x[1] = x[1] - step0 * gradient[1];
        
        i += 1;
        if (func(x) >= func(xPrev)) {
            step0 = step0 / 2;
        }
    }
    
    console.log(`Минимум найден в точке x = [${x}]` + '\n' + 
                `Значение функции в точке минимума: ${func(x)}\n` + 
                `Количество итераций: ${i}`);
}

gradientMethodWithFixedStep();