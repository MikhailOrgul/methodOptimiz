const costs = [
    [2, 4, 1, 3],
    [5, 6, 5, 4],
    [3, 7, 9, 5],
    [1, 2, 2, 7]
];

const supply = [30, 20, 40, 50];
const demand = [35, 20, 55, 30];

function northwestCornerMethod(costs, supply, demand) {
    const m = supply.length;
    const n = demand.length;
    const allocation = Array.from({ length: m }, () => Array(n).fill(null));
    let i = 0, j = 0;
    const s = supply.slice(), d = demand.slice();

    while (i < m && j < n) {
        const alloc = Math.min(s[i], d[j]);
        allocation[i][j] = alloc;
        s[i] -= alloc;
        d[j] -= alloc;
        if (s[i] === 0 && d[j] === 0) {
            if (i < m - 1) i++;
            else j++;
        } else if (s[i] === 0) {
            i++;
        } else {
            j++;
        }
    }
    return allocation;
}

function computePotentials(costs, allocation) {
    const m = costs.length;
    const n = costs[0].length;
    const u = Array(m).fill(null);
    const v = Array(n).fill(null);
    u[0] = 0;

    // отмечаем базисные клетки
    const base = [];
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (allocation[i][j] !== null) {
                base.push([i, j]);
            }
        }
    }

    let updated;
    do {
        updated = false;
        for (const [i, j] of base) {
            if (u[i] !== null && v[j] === null) {
                v[j] = costs[i][j] - u[i];
                updated = true;
            }
            if (v[j] !== null && u[i] === null) {
                u[i] = costs[i][j] - v[j];
                updated = true;
            }
        }
    } while (updated);

    let minDelta = 0;
    let minCell = null;
    let optimal = true;
    const delta = Array.from({ length: m }, () => Array(n).fill(null));

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (allocation[i][j] === null) {
                delta[i][j] = costs[i][j] - u[i] - v[j];
                // if(delta[i][j] <= 0){
                //     minDelta = delta[i][j];
                //     minCell = [i, j];
                //     optimal = false;
                // }
                if (delta[i][j] < minDelta) {
                    minDelta = delta[i][j];
                    minCell = [i, j];
                    // console.log(minDelta, minCell, costs[i][j])
                    optimal = false;
                }
            }
        }
    }
    // console.log(delta, minCell, optimal)
    return { delta, minCell, optimal };
}


function findCycle(allocation, start) {
    const m = allocation.length;
    const n = allocation[0].length;
    const basis = [];

    // Сбор всех базисных клеток (включая стартовую)
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (allocation[i][j] !== null || (i === start[0] && j === start[1])) {
                basis.push([i, j]);
            }
        }
    }

    const queue = [[start]];
    
    while (queue.length > 0) {
        const path = queue.shift();
        const last = path[path.length - 1];
        const [li, lj] = last;

        const nextIsRow = path.length % 2 === 1;

        for (const [ni, nj] of basis) {
            if (ni === li && nj === lj) continue; // пропустить себя

            if (nextIsRow && ni !== li) continue;
            if (!nextIsRow && nj !== lj) continue;

            const next = [ni, nj];

            // Проверка на замыкание цикла
            if (ni === start[0] && nj === start[1] && path.length >= 4) {
                console.log([...path, next])
                return [...path, next];
            }

            // Пропуск уже посещённых клеток
            let alreadyUsed = false;
            for (const [pi, pj] of path) {
                if (pi === ni && pj === nj) {
                    alreadyUsed = true;
                    break;
                }
            }
            if (alreadyUsed) continue;

            queue.push([...path, next]);
        }
    }

    return [];
}



function adjustAllocation(allocation, cycle) {
    const signs = cycle.map((_, idx) => idx % 2 === 0 ? '+' : '-');
    console.log(signs)
    let theta = Infinity;

    for (let k = 0; k < cycle.length; k++) {
        if (signs[k] === '-') {
            const [i, j] = cycle[k];
            theta = Math.min(theta, allocation[i][j]);
            // console.log(`theta = ${theta}`)
        }
    }

    for (let k = 0; k < cycle.length-1; k++) {
        const [i, j] = cycle[k];
        if (signs[k] === '+') {
            console.log(allocation[i][j]) //null 5 20 15 
            allocation[i][j] = (allocation[i][j] || 0) + theta;
            // console.log(allocation[i][j]) //15 20 35 30
        } else { 
            // console.log(allocation[i][j])
            allocation[i][j] -= theta;
            if (allocation[i][j] === 0) allocation[i][j] = null;
        }
    }
}

function calculateTotalCost(costs, allocation) {
    let total = 0;
    for (let i = 0; i < allocation.length; i++) {
        for (let j = 0; j < allocation[0].length; j++) {
            if (allocation[i][j] !== null) {
                total += allocation[i][j] * costs[i][j];
            }
        }
    }
    return total;
}

function solveTransportation(costs, supply, demand) {
    let allocation = northwestCornerMethod(costs, supply, demand);
    let i = 1
    while (true) {
        const { minCell, optimal } = computePotentials(costs, allocation);
        console.log(i++, minCell, optimal, allocation)
        if (optimal) break;
        const cycle = findCycle(allocation, minCell);
        adjustAllocation(allocation, cycle);
    }
    const total = calculateTotalCost(costs, allocation);
    return { allocation, total };
}

// Запуск
const { allocation, total } = solveTransportation(costs, supply, demand);
console.log("Финальный план перевозок:");
allocation.forEach(row =>
    console.log(row.map(x => (x === null ? '  .' : x.toString().padStart(3))).join(" "))
);
console.log("\nОбщая стоимость перевозок:", total);
