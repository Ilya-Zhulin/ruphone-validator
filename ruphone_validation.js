/**
 * File ruphone_validation.js is programmed by
 * Ilya A.Zhulin <ilya.zhulin@hotmail.com> 2022
 *
 * @version         2.0
 * @url				https://github.com/Ilya-Zhulin/ruphone-validator
 * @editor			Ilya A.Zhulin - https://www.zhulinia.ru
 * @copyright		Copyright (C) 2020 - 2022 Ilya A.Zhulin. All Rights Reserved.
 *
 */

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("input[type='tel'], input[data-type='tel']").forEach(item => {
        item.addEventListener('input', function (e) {
            let allows = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '+', '*', '!'],
                    force = (item.getAttribute('data-rutel') === 'force') ? 1 : 0,
                    caret = e.target.selectionStart,
                    new_caret = 0,
                    new_caret_moving = 0,
                    val = item.value,
                    arr = [],
                    k = 0,
                    length,
                    pattern1 = ['_', '_', ' ', '(', '_', '_', '_', ')', ' ', '_', '_', '_', '-', '_', '_', '-', '_', '_'],
                    pattern2 = ['_', '_', ' ', '(', '_', '_', '_', '_', ')', ' ', '_', '_', '-', '_', '_', '-', '_', '_'],
                    pattern3 = ['_', ' ', '(', '_', '_', '_', ')', ' ', '_', '_', '_', '-', '_', '_', '-', '_', '_'],
                    pattern4 = ['_', ' ', '(', '_', '_', '_', '_', ')', ' ', '_', '_', '-', '_', '_', '-', '_', '_'],
                    pattern = [];
//            console.log('=============================');
//            console.log('Курсор исходный: ' + caret);
            new_caret = caret;
            /* удаление и замена на подчеркивание */
            if (e.inputType === 'deleteContentBackward') {
                val = val.slice(0, caret) + '*' + val.slice(caret);
//                console.log("Удаление. Новое значение: " + val);
            }
            else {
                val = val.slice(0, caret) + '!' + val.slice(caret);
            }
            arr = val.split("");
//            console.log('Курсор: ' + new_caret);
            arr.forEach((el, i) => {
                // Запрещённые символы
                if (allows.indexOf(el) === -1 || (i > 0 && el == '+')) {
                    arr[i] = '';
                    new_caret = (caret >= i) ? caret - 1 : caret;
//                    console.log('Удалён недопустимый символ: ' + el);
                }
            });
//            console.log('test: ' + arr);
            if (arr[0] == '8') {
                if (force === 0) {
                    pattern = (arr[3] && arr[3] == '9') ? pattern3 : pattern4;
                }
                else {
                    arr.shift();
                    arr.unshift('+', '7');
                }
            }
            else {
                pattern = (arr[4] && arr[4] == '9') ? pattern1 : pattern2;
            }
            length = pattern.length;
//            console.log(arr);
//            console.log('Курсор: ' + new_caret);
            arr.forEach((el, i) => {
                if (k < length && el != '') {
                    while (pattern[k] != '_') {
                        k++;
                        if (new_caret_moving > 0 || new_caret === (k)) {
                            new_caret++;
                            new_caret_moving++;
//                            console.log('Смещение курсора+: ' + new_caret);
                        }
                    }
                    if (el == '*') {
                        if (pattern[k] == '-' || pattern[k] == ' ' || pattern[k] == ')' || pattern[k] == '(') {
                            while (pattern[k] == '-' || pattern[k] == ' ' || pattern[k] == ')' || pattern[k] == '(') {
                                console.log("Знак: " + pattern[k]);
                                new_caret = k - 1;
//                                console.log('Смещение курсора-: ' + new_caret);
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
//                            console.log('Смещение курсора-: ' + new_caret);
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
//            console.log(pattern);
            item.value = pattern.join('');
            item.setSelectionRange(new_caret, new_caret);
        });
    });
});