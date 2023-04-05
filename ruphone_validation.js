/**
 * File ruphone_validation.js is programmed by
 * Ilya A.Zhulin <ilya.zhulin@hotmail.com> 2023
 *
 * @version         2.2
 * @url				https://github.com/Ilya-Zhulin/ruphone-validator
 * @editor			Ilya A.Zhulin - https://www.zhulinia.ru
 * @copyright		Copyright (C) 2020 - 2022 Ilya A.Zhulin. All Rights Reserved.
 *
 */


/**
 * Обработка отдельного поля
 */
function _telValidate(field) {
    field.addEventListener('input', function (e) {
        let allows = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '+', '*', '!'],
                force = (field.getAttribute('data-rutel') === 'force') ? 1 : 0,
                caret = e.target.selectionStart,
                new_caret = 0,
                new_caret_moving = 0,
                val = field.value,
                arr = [],
                k = 0,
                length,
                pattern1 = ['_', '_', ' ', '(', '_', '_', '_', ')', ' ', '_', '_', '_', '-', '_', '_', '-', '_', '_'], //+7 (901) 234-56-78
                pattern2 = ['_', '_', ' ', '(', '_', '_', '_', '_', ')', ' ', '_', '_', '-', '_', '_', '-', '_', '_'], //+7 (0123) 34-56-78
                pattern3 = ['_', ' ', '(', '_', '_', '_', ')', ' ', '_', '_', '_', '-', '_', '_', '-', '_', '_'], //8 (901) 234-56-78
                pattern4 = ['_', ' ', '(', '_', '_', '_', '_', ')', ' ', '_', '_', '-', '_', '_', '-', '_', '_'], //8 (0123) 34-56-78
                pattern = [],
                three_codes = [
                    '495', '499', // Москва
                    '812', // С-Петербург
                    '496', // С. Посад
                    '343', // Е-бург
                    '861', // Краснодар
                    '863', // Р. на Дону
                    '351', // Челябинск
                    '383', // Новосибирск
                    '846', // Самара
                    '342', // Пермь
                    '843', // Казань
                    '347', // Уфа
                    '831', // Н. Новгород
                    '391', // Красноярск
                    '473', // Воронеж
                    '423', // Владивосток
                    '862', // Сочи
                ],
                geo_codes = ['3', '4', '8', '9']; // Разрешённые цифры начала геокода
        new_caret = caret;
        /* удаление и замена на подчеркивание */
        if (e.inputType === 'deleteContentBackward') {
            val = val.slice(0, caret) + '*' + val.slice(caret);
        }
        else {
            val = val.slice(0, caret) + '!' + val.slice(caret);
        }
        arr = val.split("");
        arr.forEach((el, i) => {
            // Запрещённые символы
            if (
                    allows.indexOf(el) === -1 // Должны быть только цифры
                    || (i > 0 && el == '+') // или + - не первый символ
                    ) {
                console.log(i);
                arr[i] = '';
                new_caret = (caret >= i) ? caret - 1 : caret;
            }
        });
        if (arr[0] == '8') {
            if (force === 0) {
                pattern = (arr[3] && (arr[3] == '9' || three_codes.indexOf(arr[3] + arr[4] + arr[5]) > -1)) ? pattern3 : pattern4;
            }
            else {
                arr.shift();
                arr.unshift('+', '7');
                pattern = pattern1;
            }
        }
        else {
            if (arr[0] == '+') { // +XXX...
                if (arr[1] == '7') { // +7XXXXX....
                    pattern = pattern1;
                }
                else { // +6XXXX...
                    /*
                     * Если начинается на +
                     * и потом не 7 - убиваю + и добавляю
                     * принудительно +7
                     */
                    arr.shift();
                    arr.unshift('+', '7');
                }
                if (arr[2] == '') { // +7 XXXXXX
                    if (arr[3] == '') { // +7 (XXXXX
                        if (arr[4] == '9' || three_codes.indexOf(arr[4] + arr[5] + arr[6]) > -1) { // +7 (9XXXXX
                            pattern = pattern1;
                        }
                        else {// +7 (XXXXX
                            pattern = pattern2;
                        }
                    }
                    else { // +7 XXXXX
                        if (arr[3] == '9' || three_codes.indexOf(arr[3] + arr[4] + arr[5]) > -1) { // +7 9XXXXX
                            pattern = pattern1;
                        }
                        else { // +7 XXXXX
                            pattern = pattern2;
                        }
                    }
                }
                else { // +7XXXXXXX
                    if (arr[2] == '') {// +7(XXXXXXX
                        if (arr[3] == '9' || three_codes.indexOf(arr[3] + arr[4] + arr[5]) > -1) { // +7(9XXXXXXX
                            pattern = pattern1;
                        }
                        else {
                            pattern = pattern2;
                        }
                    }
                    else { //+7XXXXXXX
                        if (arr[2] == '9' || three_codes.indexOf(arr[2] + arr[3] + arr[4]) > -1) { //+79XXXXXXX
                            pattern = pattern1;
                        }
                        else { //+7XXXXXXX
                            pattern = pattern2;
                        }
                    }
                }
            }
            else {
                if (arr[0] == 7) {
                    arr.unshift('+');
                    if (arr[2] == '') { // +7 XXXXXX
                        if (arr[3] == '(') { // +7 (XXXXX
                            if (arr[4] == '9' || three_codes.indexOf(arr[4] + arr[5] + arr[6]) > -1) { // +7 (9XXXXX
                                pattern = pattern1;
                            }
                            else {// +7 (XXXXX
                                pattern = pattern2;
                            }
                        }
                        else { // +7 XXXXX
                            if (arr[3] == '9' || three_codes.indexOf(arr[3] + arr[4] + arr[5]) > -1) { // +7 9XXXXX
                                pattern = pattern1;
                            }
                            else { // +7 XXXXX
                                pattern = pattern2;
                            }
                        }
                    }
                    else { // +7XXXXXXX
                        if (arr[2] == '(') {// +7(XXXXXXX
                            if (arr[3] == '9' || three_codes.indexOf(arr[3] + arr[4] + arr[5]) > -1) { // +7(9XXXXXXX
                                pattern = pattern1;
                            }
                            else {
                                pattern = pattern2;
                            }
                        }
                        else { //+7XXXXXXX
                            if (arr[2] == '9' || three_codes.indexOf(arr[3] + arr[4] + arr[5]) > -1) { //+79XXXXXXX
                                pattern = pattern1;
                            }
                            else { //+7XXXXXXX
                                pattern = pattern2;
                            }
                        }
                    }
                }
                else {
                    if (arr[0] != '*') {
                        arr.unshift('+', '7');
                        if (arr[2] == '') { // +7 XXXXXX
                            if (arr[3] == '(') { // +7 (XXXXX
                                if (arr[4] == '9' || three_codes.indexOf(arr[4] + arr[5] + arr[6]) > -1) { // +7 (9XXXXX
                                    pattern = pattern1;
                                }
                                else {// +7 (XXXXX
                                    pattern = pattern2;
                                }
                            }
                            else { // +7 XXXXX
                                if (arr[3] == '9' || three_codes.indexOf(arr[3] + arr[4] + arr[5]) > -1) { // +7 9XXXXX
                                    pattern = pattern1;
                                }
                                else { // +7 XXXXX
                                    pattern = pattern2;
                                }
                            }
                        }
                        else { // +7XXXXXXX
                            if (arr[2] == '(') {// +7(XXXXXXX
                                if (arr[3] == '9' || three_codes.indexOf(arr[3] + arr[4] + arr[5]) > -1) { // +7(9XXXXXXX
                                    pattern = pattern1;
                                }
                                else {
                                    pattern = pattern2;
                                }
                            }
                            else { //+7XXXXXXX
                                if (arr[2] == '9' || three_codes.indexOf(arr[2] + arr[3] + arr[4]) > -1) { //+79XXXXXXX
                                    pattern = pattern1;
                                }
                                else { //+7XXXXXXX
                                    pattern = pattern2;
                                }
                            }
                        }
                    }
                }
            }
        }
        // Шаблон выбран

        length = pattern.length;
        arr.forEach((el, i) => {
            if (k < length && el != '') {
                while (pattern[k] != '_') {
                    k++;
                    if (new_caret_moving > 0 || new_caret === (k)) {
                        new_caret++;
                        new_caret_moving++;
                    }
                }
                if (el == '*') {
                    if (pattern[k] == '-' || pattern[k] == ' ' || pattern[k] == ')' || pattern[k] == '(') {
                        while (pattern[k] == '-' || pattern[k] == ' ' || pattern[k] == ')' || pattern[k] == '(') {
                            new_caret = k - 1;
                        }
                    }
                    else {
                        pattern[k] = '_';
                        if (new_caret_moving > 0) {
                            new_caret = k - 1;
                        }
                    }
                    k++;
                }
                else {
                    if (el == '!') {
                        new_caret = k;
                    }
                    else {
                        pattern[k] = el;
                        k++;
                    }
                }
                new_caret_moving = 0;
            }
        });
//        console.log(pattern);

        // Проверка на первую цифру географического кода
        if (pattern[0] == '8' && geo_codes.indexOf(pattern[3]) === -1) {
            new_caret = 3;
            pattern[3] = '_';
        }
        else {
            if (pattern[0] == '+' && geo_codes.indexOf(pattern[3]) === -1) {
                new_caret = 4;
                pattern[4] = '_';
            }
        }

        // Подстановка в поле
        field.value = pattern.join('');
        field.setSelectionRange(new_caret, new_caret);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("input[type='tel'], input[data-type='tel']").forEach(item => {
        _telValidate(item);
    });
    let observer = new MutationObserver(mutations => {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                if (!(node instanceof HTMLElement))
                    continue;
                if (node.matches("[type='tel']") || node.matches("[data-type='tel']")) {
                    _telValidate(node);
                }
                if (node.querySelector("[data-type='tel']")) {
                    _telValidate(node.querySelector("[data-type='tel']"));
                }
                if (node.querySelector("[type='tel']")) {
                    _telValidate(node.querySelector("[type='tel']"));
                }
            }
        }
    });
    observer.observe(document.documentElement, {
        childList: true, // наблюдать за непосредственными детьми
        subtree: true, // и более глубокими потомками
    });
});