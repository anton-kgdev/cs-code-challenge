function runIf(condition, trueFn, falseFn = () => {}) {
    const options = new Map([
        [true, trueFn],
        [false, falseFn]
    ])

    return options.get(!!condition)();
}

function getStored(key, defaultValue) {
    let value = localStorage.getItem(key);

    runIf(
        !!value,
        () => { value = JSON.parse(value); }
    )

    return value || defaultValue;
}

function storeItem(key, value) {
    runIf(
        !!value,
        () => {
            localStorage.setItem(key, JSON.stringify(value))
        }
    )
}

function extendStoredArray(key, value, skipDuplications = false) {
    const preValue = getStored(key, []);

    const setValue = () => {
        storeItem(key, [ ...preValue, value]);
    }

    runIf(
        skipDuplications,
        () => {
            runIf(
                !preValue.some((item) => item === value),
                setValue
            );
        },
        setValue
    )
}

function editStoredArrayItem(key, value, idx) {
    const storedArr = getStored(key, []);

    storedArr[idx] = value

    storeItem(key, storedArr);
}

function removeStoredArrayItem(key, idx) {
    const value = getStored(key, []);

    value.splice(idx, 1)
    storeItem(key, value);
}

function getLIIndexInUL(liEl) {
    return Array.prototype.indexOf.call(liEl.parentNode.childNodes, liEl)
}
