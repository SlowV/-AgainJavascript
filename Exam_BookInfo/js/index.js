let obj_error_empty = {};
obj_error_empty['name'] = 'Tên';
obj_error_empty['publishing_company'] = 'Nhà xuất bản';
obj_error_empty['quantity'] = 'Số lượng';
obj_error_empty['unit_price'] = 'Đơn giá';
obj_error_empty['user'] = 'Người nhập';


const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;

let hasNumber = /\d/;

document.addEventListener("DOMContentLoaded", function (event) {
    let book_name = document.querySelector('form[name="form_book"] input[name="name"]');
    let publishing_company = document.querySelector('form[name="form_book"] input[name="publishing_company"]');
    let quantity = document.querySelector('form[name="form_book"] input[name="quantity"]');
    let unit_price = document.querySelector('form[name="form_book"] input[name="unit_price"]');
    let total_price = document.querySelector('form[name="form_book"] input[name="total_price"]');
    let date_publish = document.querySelector('form[name="form_book"] input[name="date_publish"]');
    let user = document.querySelector('form[name="form_book"] input[name="user"]');

    //Check box
    let inDepot = document.querySelector('form[name="form_book"] input[name="inDepot"]');
    let sell = document.querySelector('form[name="form_book"] input[name="sell"]');
    let unchecked = document.querySelector('form[name="form_book"] input[name="unchecked"]');

    // button submit
    let btnSubmit = document.getElementById('Submit');

    let arr_event_on_key = [book_name, publishing_company, quantity, unit_price, user];

    let isEmpty = true;
    let isSpecialKeyAndNumber = true;
    let isUnSigned = false;
    let dateRange = false;

    let int = 0;
    btnSubmit.addEventListener('click', function () {

        for (let i = 0; i < arr_event_on_key.length; i++) {
            isEmpty = checkInputIsEmpty(arr_event_on_key[i].value,
                '.msg_' + arr_event_on_key[i].getAttribute('name'),
                arr_event_on_key[i].getAttribute('name'));
            if (isEmpty) {
                arr_event_on_key[i].addEventListener('onmouseover', function () {
                    arr_event_on_key[i].select();
                });
                return;
            }
        }

        isSpecialKeyAndNumber = checkContainsSpecialKeyAndNumber(user.value);
        isUnSigned = checkUnsigned(unit_price.value);
        dateRange = validRangeDate(date_publish.value);


        if (!isEmpty && !isSpecialKeyAndNumber && isUnSigned && dateRange) {
            let checkbox = document.getElementsByClassName('myCheckbox');
            let valueCheckbox = '';
            for (let i = 0; i < checkbox.length; i++) {
                if (checkbox[i].checked){
                    valueCheckbox += checkbox[i].value + ', ';
                }
            }
            let book_category = document.getElementById('book_category');
            let book = {
                name                : book_name.value,
                publishing_company  : publishing_company.value,
                quantity            : quantity.value,
                unit_price          : unit_price.value,
                total_price         : int,
                date_publish        : formatDate(date_publish.value),
                book_category       : book_category.options[book_category.selectedIndex].value,
                user                : user.value,
                existent            : valueCheckbox
            };
            let keyName = 'Book_' + new Date().getTime();
            localStorage.setItem(keyName, JSON.stringify(book));
            window.location.href = "book_complete.html?keyname=" + keyName;
        }
    });

    document.getElementById('btn_reset').addEventListener('click',function () {
        let checkbox = document.getElementsByClassName('myCheckbox');
        for (let i = 0; i < checkbox.length; i++) {
            if (checkbox[i].hasAttribute('disabled')){
                checkbox[i].removeAttribute('disabled');
            }
        }
    });

    quantity.addEventListener('focusout', function () {
        quantity = document.querySelector('form[name="form_book"] input[name="quantity"]');
        unit_price = document.querySelector('form[name="form_book"] input[name="unit_price"]');
        if (unit_price != null || unit_price.value.length != 0 && quantity != null || quantity.value.length != 0) {
            int = calc_total_price(unit_price.value, quantity.value);
            total_price.value = int + ' VNĐ';
        } else {
            total_price.value = 0;
        }
    });

    unit_price.addEventListener('focusout', function () {
        quantity = document.querySelector('form[name="form_book"] input[name="quantity"]');
        unit_price = document.querySelector('form[name="form_book"] input[name="unit_price"]');
        if (unit_price != null || unit_price.value.length != 0 && quantity != null || quantity.value.length != 0) {
            int = calc_total_price(unit_price.value, quantity.value);
            total_price.value = int + ' VNĐ';
        } else {
            total_price.value = 0;
        }
    });


    inDepot.addEventListener('click', function () {
        if (inDepot.checked || sell.checked) {
            unchecked.setAttribute('disabled', 'true');
        } else {
            unchecked.removeAttribute('disabled');
        }
    });

    sell.addEventListener('click', function () {
        if (sell.checked || inDepot.checked) {
            unchecked.setAttribute('disabled', 'true');
        } else {
            unchecked.removeAttribute('disabled');
        }
    });

    unchecked.addEventListener('click', function () {
        if (unchecked.checked) {
            inDepot.setAttribute('disabled', 'true');
            sell.setAttribute('disabled', 'true');
        } else {
            inDepot.removeAttribute('disabled');
            sell.removeAttribute('disabled');
        }
    })
});

function checkInputIsEmpty(stringValue, msgClass, key) {
    let msg_error = document.querySelector(msgClass);
    if (stringValue == null || stringValue.length === 0) {
        msg_error.innerHTML = obj_error_empty[key] + ' không được để trống!';
        if (msg_error.classList.contains('d_none')) msg_error.classList.remove('d_none');
        return true
    } else {
        msg_error.innerHTML = '';
        if (!msg_error.classList.contains('d_none')) msg_error.classList.add('d_none');
    }
    return false;
}

function checkContainsSpecialKeyAndNumber(stringValue) {
    let msg_error = document.querySelector('.msg_user');
    let user = document.querySelector('form[name="form_book"] input[name="user"]');
    //Check tồn tại ký tự đặc biệt
    let stringSplited = stringValue.split(" ");
    let newString = '';
    for (let i = 0; i < stringSplited.length; i++) {
        newString += stringSplited[i];
    }
    if (format.test(newString)) {
        if (msg_error.classList.contains('d_none')) msg_error.classList.remove('d_none');
        msg_error.innerHTML = 'Tồn tại ký tự đặc biệt vui lòng nhập lại a-z A-Z!';
        user.addEventListener('mouseover', function () {
            user.select();
        });
        return true;
    } else if (hasNumber.test(newString)) {
        if (msg_error.classList.contains('d_none')) msg_error.classList.remove('d_none');
        msg_error.innerHTML = 'Tồn tại dạng số vui lòng nhập lại trong a-z A-Z!';
        user.addEventListener('onmouseover', function () {
            user.select();
        });
        return true;
    } else {
        if (!msg_error.classList.contains('d_none')) msg_error.classList.add('d_none');
    }
    return false;
}

function checkUnsigned(number) {
    let msg_unit_price = document.querySelector('.msg_unit_price');
    let unit_price = document.querySelector('form[name="form_book"] input[name="unit_price"]');
    if (number > 0) {
        if (!msg_unit_price.classList.contains('d_none')) msg_unit_price.classList.add('d_none');
        return true;
    }
    unit_price.addEventListener('onmouseover', function () {
        unit_price.select();
    });
    msg_unit_price.innerHTML = "Vui lòng nhập giá lớn hơn 0";
    if (msg_unit_price.classList.contains('d_none')) msg_unit_price.classList.remove('d_none');
    unit_price.value = 0;
    return false;
}

function validRangeDate(date) {
    let minDate = new Date('01/01/1990').getTime();
    let now = new Date().getTime();
    let dateCompare = new Date(date);
    let msg_date = document.querySelector('.msg_date_publish');
    if (minDate < dateCompare && dateCompare <= now) {
        if (!msg_date.classList.contains('d_none')) msg_date.classList.add('d_none');
        return true;
    } else {
        msg_date.innerHTML = 'Ngày xuất bản không hợp lệ vui lòng chọn trong khoảng 01/01/1990 ~ ngày hiện tại!';
        if (msg_date.classList.contains('d_none')) msg_date.classList.remove('d_none');
    }
    return false
}

function calc_total_price(unit_price, quantity) {
    return unit_price * quantity;
}

function formatDate(date) {
    let newDate = new Date(date);
    let day = newDate.getDay();
    let month = newDate.getMonth();
    let year = newDate.getFullYear();

    return day + '/' + month + '/' + year;
}
