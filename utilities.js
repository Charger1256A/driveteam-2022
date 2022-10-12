function getMin(data, key) {
    if (!data) {
        return;
    }
    var min;
    for (var match in data) {
        if (!min) {
            min = data[match][key];
        } else if (data[match][key] < min) {
            min = data[match][key];
        }
    }
    return min;
}

function getAvg(data, key) {
    if (!data) {
        return;
    }
    var total = 0;
    var count = 0;
    for (var match in data) {
        total += data[match][key];
        count++;
    }
    
    return Math.round(total/count * 100) / 100;
}

function getMax(data, key) {
    if (!data) {
        return;
    }
    var max = 0;
    for (var match in data) {
        if (data[match][key] > max) {
            max = data[match][key];
        }
    }
    return max;
}

function getAcc(data, key) {
    if (!data) {
        return;
    }

    var expectedTotal = 0;
    var totalMade = 0;

    for (var match in data) {
        expectedTotal += data[match][`expected_${key}`];
        totalMade += data[match][key];
    }

    if (expectedTotal === 0) {
        return 1;
    }

    return Math.round(totalMade/expectedTotal * 100) / 100;
}

function getClimbTot(data, key) {
    if (!data) {
        return;
    }

    var count = 0;
    for (var match in data) {
        if (data[match]["endgame"] === key) {
            count++;
        }
    }

    return count;
}

export { getMin, getAvg, getMax, getAcc, getClimbTot };