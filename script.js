
const display = document.getElementById("display");
const history = document.getElementById("history");

let expression = "";
let memory = 0;

let calculationHistory =
    JSON.parse(
        localStorage.getItem("calculatorHistory")
    ) || [];


/* =========================
   CALCULATOR BUTTONS
========================= */

const buttons =
    document.querySelectorAll(
        "button[data-value]"
    );


buttons.forEach(button => {

    button.addEventListener("click", () => {

        const value =
            button.dataset.value;

        expression += value;

        display.textContent =
            expression;

    });

});


/* =========================
   CLEAR
========================= */

document
    .querySelector('[data-action="clear"]')
    .addEventListener("click", clearCalculator);


function clearCalculator() {

    expression = "";

    display.textContent = "0";

    history.textContent = "";

}


/* =========================
   DELETE
========================= */

document
    .querySelector('[data-action="delete"]')
    .addEventListener("click", () => {

        expression =
            expression.slice(0, -1);

        display.textContent =
            expression || "0";

    });


/* =========================
   CALCULATE
========================= */

document
    .querySelector('[data-action="calculate"]')
    .addEventListener(
        "click",
        calculate
    );


function calculate() {

    if (!expression) {
        return;
    }


    try {

        let calculation =
            expression;


        /* Constants */

        calculation =
            calculation
                .replace(
                    /π/g,
                    "Math.PI"
                )
                .replace(
                    /\be\b/g,
                    "Math.E"
                );


        /* Functions */

        calculation =
            calculation
                .replace(
                    /sqrt\(/g,
                    "Math.sqrt("
                )
                .replace(
                    /sin\(/g,
                    "Math.sin("
                )
                .replace(
                    /cos\(/g,
                    "Math.cos("
                )
                .replace(
                    /tan\(/g,
                    "Math.tan("
                )
                .replace(
                    /log\(/g,
                    "Math.log10("
                )
                .replace(
                    /ln\(/g,
                    "Math.log("
                );


        /* Percentage */

        calculation =
            calculation.replace(
                /(\d+(?:\.\d+)?)%/g,
                "($1/100)"
            );


        /* Square */

        calculation =
            calculation.replace(
                /(\d+(?:\.\d+)?)\^2/g,
                "($1**2)"
            );


        /* Power */

        calculation =
            calculation.replace(
                /(\d+(?:\.\d+)?)\^(\d+(?:\.\d+)?)/g,
                "($1**$2)"
            );


        /* Factorial */

        calculation =
            calculation.replace(
                /(\d+(?:\.\d+)?)!/g,
                "factorial($1)"
            );


        const result =
            Function(
                "factorial",
                `"use strict"; return (${calculation})`
            )(factorial);


        if (
            !Number.isFinite(result)
        ) {

            throw new Error();

        }


        const finalResult =
            Number(
                result.toFixed(10)
            );


        history.textContent =
            expression + " =";


        display.textContent =
            finalResult;


        addToHistory(
            expression,
            finalResult
        );


        expression =
            finalResult.toString();

    }

    catch {

        display.textContent =
            "Error";

        history.textContent =
            "Invalid calculation";

        expression = "";

    }

}


/* =========================
   FACTORIAL
========================= */

function factorial(number) {

    if (
        number < 0 ||
        !Number.isInteger(number) ||
        number > 170
    ) {

        throw new Error();

    }


    let result = 1;


    for (
        let i = 2;
        i <= number;
        i++
    ) {

        result *= i;

    }


    return result;

}


/* =========================
   MEMORY
========================= */

document
    .querySelectorAll(
        "[data-memory]"
    )
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const action =
                    button.dataset.memory;


                const currentValue =
                    parseFloat(
                        display.textContent
                    ) || 0;


                if (action === "MC") {

                    memory = 0;

                }


                else if (action === "MR") {

                    expression =
                        memory.toString();

                    display.textContent =
                        expression;

                }


                else if (action === "M+") {

                    memory +=
                        currentValue;

                }


                else if (action === "M-") {

                    memory -=
                        currentValue;

                }

            }
        );

    });


/* =========================
   HISTORY
========================= */

function addToHistory(
    expression,
    result
) {

    calculationHistory.unshift({

        expression:
            expression,

        result:
            result

    });


    if (
        calculationHistory.length > 20
    ) {

        calculationHistory.pop();

    }


    localStorage.setItem(
        "calculatorHistory",
        JSON.stringify(
            calculationHistory
        )
    );


    renderHistory();

}


function renderHistory() {

    const historyList =
        document.getElementById(
            "historyList"
        );


    if (
        calculationHistory.length === 0
    ) {

        historyList.textContent =
            "No calculations yet";

        return;

    }


    historyList.innerHTML = "";


    calculationHistory.forEach(
        item => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "history-item";


            const expressionSpan =
                document.createElement(
                    "span"
                );


            expressionSpan.textContent =
                item.expression;


            const resultStrong =
                document.createElement(
                    "strong"
                );


            resultStrong.textContent =
                item.result;


            div.appendChild(
                expressionSpan
            );


            div.appendChild(
                resultStrong
            );


            historyList.appendChild(
                div
            );

        }
    );

}


/* =========================
   CLEAR HISTORY
========================= */

document
    .getElementById(
        "clearHistory"
    )
    .addEventListener(
        "click",
        () => {

            calculationHistory = [];

            localStorage.removeItem(
                "calculatorHistory"
            );

            renderHistory();

        }
    );


/* =========================
   DARK MODE
========================= */

document
    .getElementById("themeBtn")
    .addEventListener(
        "click",
        () => {

            document.body.classList.toggle(
                "dark"
            );


            const darkMode =
                document.body.classList.contains(
                    "dark"
                );


            document.getElementById(
                "themeBtn"
            ).textContent =
                darkMode
                    ? "☀️"
                    : "🌙";

        }
    );


/* =========================
   SMART TOOLS
========================= */

const toolButtons =
    document.querySelectorAll(
        "[data-tool]"
    );


const toolBoxes =
    document.querySelectorAll(
        ".tool-box"
    );


toolButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            const selectedTool =
                button.dataset.tool;


            toolBoxes.forEach(box => {

                box.classList.remove(
                    "active"
                );

            });


            document
                .getElementById(
                    selectedTool + "Tool"
                )
                .classList.add(
                    "active"
                );

        }
    );

});


/* =========================
   BMI
========================= */

document
    .getElementById(
        "calculateBMI"
    )
    .addEventListener(
        "click",
        () => {

            const weight =
                parseFloat(
                    document.getElementById(
                        "bmiWeight"
                    ).value
                );


            const height =
                parseFloat(
                    document.getElementById(
                        "bmiHeight"
                    ).value
                );


            const result =
                document.getElementById(
                    "bmiResult"
                );


            if (
                !weight ||
                !height ||
                weight <= 0 ||
                height <= 0
            ) {

                result.textContent =
                    "Please enter valid values.";

                return;

            }


            const heightMeter =
                height / 100;


            const bmi =
                weight /
                (
                    heightMeter *
                    heightMeter
                );


            let category;


            if (bmi < 18.5) {

                category =
                    "Underweight";

            }

            else if (bmi < 25) {

                category =
                    "Normal";

            }

            else if (bmi < 30) {

                category =
                    "Overweight";

            }

            else {

                category =
                    "Obese";

            }


            result.textContent =
                `BMI: ${bmi.toFixed(2)} — ${category}`;

        }
    );


/* =========================
   EMI
========================= */

document
    .getElementById(
        "calculateEMI"
    )
    .addEventListener(
        "click",
        () => {

            const principal =
                parseFloat(
                    document.getElementById(
                        "loanAmount"
                    ).value
                );


            const annualRate =
                parseFloat(
                    document.getElementById(
                        "interestRate"
                    ).value
                );


            const years =
                parseFloat(
                    document.getElementById(
                        "loanYears"
                    ).value
                );


            const result =
                document.getElementById(
                    "emiResult"
                );


            if (
                !principal ||
                annualRate < 0 ||
                !years ||
                principal <= 0 ||
                years <= 0
            ) {

                result.textContent =
                    "Please enter valid values.";

                return;

            }


            const monthlyRate =
                annualRate / 12 / 100;


            const months =
                years * 12;


            let emi;


            if (
                monthlyRate === 0
            ) {

                emi =
                    principal / months;

            }

            else {

                emi =
                    principal *
                    monthlyRate *
                    Math.pow(
                        1 + monthlyRate,
                        months
                    ) /
                    (
                        Math.pow(
                            1 + monthlyRate,
                            months
                        ) - 1
                    );

            }


            result.textContent =
                `Monthly EMI: ₹${emi.toFixed(2)}`;

        }
    );


/* =========================
   AGE
========================= */

document
    .getElementById(
        "calculateAge"
    )
    .addEventListener(
        "click",
        () => {

            const birthDate =
                document.getElementById(
                    "birthDate"
                ).value;


            const result =
                document.getElementById(
                    "ageResult"
                );


            if (!birthDate) {

                result.textContent =
                    "Please select your birth date.";

                return;

            }


            const birth =
                new Date(
                    birthDate + "T00:00:00"
                );


            const today =
                new Date();


            if (birth > today) {

                result.textContent =
                    "Birth date cannot be in the future.";

                return;

            }


            let age =
                today.getFullYear() -
                birth.getFullYear();


            const monthDifference =
                today.getMonth() -
                birth.getMonth();


            if (
                monthDifference < 0 ||
                (
                    monthDifference === 0 &&
                    today.getDate() <
                    birth.getDate()
                )
            ) {

                age--;

            }


            result.textContent =
                `Your age is ${age} years`;

        }
    );


/* =========================
   LENGTH CONVERTER
========================= */

document
    .getElementById(
        "convertLength"
    )
    .addEventListener(
        "click",
        () => {

            const value =
                parseFloat(
                    document.getElementById(
                        "convertValue"
                    ).value
                );


            const from =
                document.getElementById(
                    "fromUnit"
                ).value;


            const to =
                document.getElementById(
                    "toUnit"
                ).value;


            const result =
                document.getElementById(
                    "converterResult"
                );


            if (
                Number.isNaN(value)
            ) {

                result.textContent =
                    "Please enter a value.";

                return;

            }


            const units = {

                meter: 1,

                km: 1000,

                cm: 0.01,

                feet: 0.3048,

                inch: 0.0254

            };


            const meters =
                value * units[from];


            const converted =
                meters / units[to];


            result.textContent =
                `${value} ${from} = ${converted.toFixed(4)} ${to}`;

        }
    );


/* =========================
   KEYBOARD
========================= */

document.addEventListener(
    "keydown",
    event => {

        const key =
            event.key;


        if (
            (key >= "0" && key <= "9") ||
            [
                "+",
                "-",
                "*",
                "/",
                ".",
                "(",
                ")",
                "%"
            ].includes(key)
        ) {

            expression += key;

            display.textContent =
                expression;

        }


        else if (
            key === "Enter"
        ) {

            calculate();

        }


        else if (
            key === "Backspace"
        ) {

            expression =
                expression.slice(
                    0,
                    -1
                );

            display.textContent =
                expression || "0";

        }


        else if (
            key === "Escape"
        ) {

            clearCalculator();

        }

    }
);


/* =========================
   INITIAL LOAD
========================= */

renderHistory();
