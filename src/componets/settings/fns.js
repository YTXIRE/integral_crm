export const numberWithSpaces = (x) => {
    var parts = '';
    if (x.toString().includes(',')) {
        parts = x.toString().split(",");
    } else {
        parts = x.toString().split(".");
    }
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    if (parts.length === 1) {
        parts.push('00')
    } else if (parts[1].length === 1) {
        parts[1] += 0;
    }
    return parts.join(",");
};

export const checkMinus = (data) => {
    return data.toString().includes('-')
};

export const firstLetterToLowerCase = (str) => str[0].toUpperCase() + str.slice(1);