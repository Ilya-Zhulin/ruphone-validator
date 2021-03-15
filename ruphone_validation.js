/*
 * File ruphone_validation.js is programmed by
 * Ilya A.Zhulin <ilya.zhulin@hotmail.com> 2020
 */

jQuery(document).ready(function () {
    function addSybmol(ar, i, s) {
        if (ar.length > i && ar[i] != s) {
            ar.splice(i, 0, s);
        }
        return ar
    }
    var a, b;
    if (document.querySelector("input[type='tel']")) {
        document.querySelector("input[type='tel']").onselect = function () {
            a = document.querySelector("input[type='tel']").selectionStart;
            b = document.querySelector("input[type='tel']").selectionEnd;
        };
    }
    jQuery("input[type='tel'], input[data-type='tel']").on('input', function (e, q) {
        $this = jQuery(this);
        allows = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
        key = e.originalEvent['data'];
        $caret = e.target.selectionStart;
        $val = $this.val();
        rep = '';
        if (a && b) {
            if (b - a > 0) {
                rep = new Array(b - a).join('_');
            } else {
                rep = '';
            }
        }
        /* удаление и замена на подчеркивание */
        if (e.originalEvent['inputType'] == 'deleteContentBackward') {
            $val = $val.substr(0, $caret) + '_' + rep + $val.substr($caret);
            e.preventDefault();
        } else {
            if ($val.indexOf('_') > -1) {
                $val = $val.substr(0, $caret) + $val.substr($caret).replace('_', '');
            }
        }
        val = $val.replace(/\s/g, '').replace('+', '').replace('(', '').replace(')', '').replace(/\-/g, '');
        val = (val.length >= 11) ? val = val.substr(0, 11) : val;
        /* Только цифры */
        if (jQuery.inArray(key, allows) == -1) {
            e.preventDefault();
            val = val.replace(key, '');
        }
        ar = val.split('');
        if (ar.join('').replace(/_/g, '').length == 0 || ar.join('').replace(/_/g, '') == '+') {
            ar = [];
        }
        if (ar.length > 0) {
            if (ar[0] != 8 && ar[0] != 7 && ar[0] != '+') {
                tmp = ar[0];
                ar[0] = '7';
                ar[1] = tmp;
                $caret = 5;
            }
            ar = addSybmol(ar, 1, ' ');
            ar = addSybmol(ar, 2, '(');
            ar = addSybmol(ar, 6, ')');
            ar = addSybmol(ar, 7, ' ');
            ar = addSybmol(ar, 11, '-');
            ar = addSybmol(ar, 14, '-');
        }
        e.preventDefault();
        $new_val = (ar[0] == '7' || ar.length === 0) ? '+' + ar.join('') : ar.join('');
        if ($new_val == '+' && key != '+') {
            $new_val = '';
        }
        $this.val($new_val);
        /*Рассчет положения каретки */
        if (e.originalEvent['inputType'] == 'deleteContentBackward') {
            if (ar[0] == 8) {
                $new_caret = ($caret == 2) ? 1 : (($caret == 7) ? 6 : (($caret == 12) ? 11 : (($caret == 15) ? 14 : $caret)));
            } else {
                $new_caret = ($caret == 3) ? 2 : (($caret == 8) ? 7 : (($caret == 13) ? 12 : (($caret == 16) ? 15 : (($caret == 1) ? 3 : $caret))));
            }
        } else {
            if (ar[0] == 8) {
                $new_caret = ($caret == 2) ? 4 : (($caret == 7) ? 9 : (($caret == 12) ? 13 : (($caret == 15) ? 16 : $caret)));
            } else {
                $new_caret = ($caret == 3) ? 5 : (($caret == 8) ? '10' : (($caret == 13) ? 14 : (($caret == '16') ? 17 : $caret)));
            }
        }
        jQuery(this)[0].setSelectionRange($new_caret, $new_caret);
    });
});