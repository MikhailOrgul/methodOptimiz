const f1 = (x1, x2) => {
    return 2*x1 + 2*x2
}

const f2 = (x1, x2) => {
    return -x1 + x2
}

const f3 = (x1, x2) => {
    return x1 - x2
}

const dotsABCD = [
                    [3, 0],
                    [3, 5],
                    [4/3, 5],
                    [0, 3]
                ]

const additiveLayout = (dotsABCD, f1, f2, f3) => {
    const a1 = 0.5
    const a2 = 0.25
    const a3 = 0.25
    const normal = () => {
        for (i in dotsABCD) {
            dotsABCD[i].push(f1(dotsABCD[i][0], dotsABCD[i][1]))
            dotsABCD[i].push(f2(dotsABCD[i][0], dotsABCD[i][1]))
            dotsABCD[i].push(f3(dotsABCD[i][0], dotsABCD[i][1]))
        }
        const maxf1 = Math.max(...dotsABCD.map(element => element[2]));
        const maxf2 = Math.max(...dotsABCD.map(element => element[3]));
        const maxf3 = Math.max(...dotsABCD.map(element => element[4]));
        dotsABCD.forEach(element => {
            element[2] /= maxf1
            element[3] /= maxf2
            element[4] /= maxf3
        });
        return dotsABCD
    }
    let result = []
    normal(dotsABCD).forEach(elem => {
        result.push(a1 * elem[2] + a2 * elem[3] + a3 * elem[4])
    })
    return Math.max(...result)
}

const mainCriteria = (dotsABCD, f1) => {
    const satisfiesConstraints = (x1, x2) => {
        return (
            -3 * x1 + 2 * x2 <= 6 &&
            x1 + x2 >= 3 &&
            x1 <= 3 &&
            x2 <= 5 &&
            x1 >= 0 &&
            x2 >= 0
        );
    }

    result = []

    for (i = 0; i < dotsABCD.length; i++) {
        const [x1, x2] = dotsABCD[i]
        if (x1 === x2 && satisfiesConstraints(x1, x1)) {
            result.push(f1(x1, x2))
        }
        else return 'Решение не оптимально'
    }

    return Math.max(result)
}

const perfectDot = (dotsABCD, f1, f2, f3) => {
    for (i in dotsABCD) {
            dotsABCD[i].push(f1(dotsABCD[i][0], dotsABCD[i][1]))
            dotsABCD[i].push(f2(dotsABCD[i][0], dotsABCD[i][1]))
            dotsABCD[i].push(f3(dotsABCD[i][0], dotsABCD[i][1]))
        }
    const maxf1 = Math.max(...dotsABCD.map(element => element[2]));
    const maxf2 = Math.max(...dotsABCD.map(element => element[3]));
    const maxf3 = Math.max(...dotsABCD.map(element => element[4]));
    const pX = (maxf1, maxf2, maxf3, dotsABCD) => {
        return Math.sqrt(
            (maxf1-(dotsABCD[2]))**2 + 
            (maxf2-(dotsABCD[3]))**2 + 
            (maxf3-(dotsABCD[4]))**2
        )
    }
    result = {}
    const letters = ['A', 'B', 'C', 'D']
    for(i = 0; i < dotsABCD.length; i++) {
        result[letters[i]] = (pX(maxf1, maxf2, maxf3, dotsABCD[i]))
    }
    return Math.min(...Object.values(result))
}

console.log(`Метод главного критерия:
    ${mainCriteria(dotsABCD, f1)}`)

console.log(`Адативной верстки: 
    Максимум в точке: B (3; 5) 
    F(B): ${additiveLayout(dotsABCD, f1, f2, f3)}`)

console.log(`Метод идеальной точки:
    Минимум в точке B (3; 5)
    p(B): ${perfectDot(dotsABCD, f1, f2, f3)}`)
