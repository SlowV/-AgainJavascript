document.addEventListener("DOMContentLoaded", function (event) {
    let url = new URL(window.location.href);
    let keyName = url.searchParams.get('keyname');
    if (keyName == null || keyName.length == 0) {
        alert('Cũng null sml rồi a ơi!');
        return;
    }
    // alert(keyName);
    loadBook(keyName);
});

function loadBook(keyName) {
    let book = JSON.parse(localStorage.getItem(keyName));
    console.log(book);
    let box = document.getElementById('book');

    box.innerHTML = ' <div>Tên sách : &nbsp;' + book.name + '</div>' +
        '            <div>Nhà xuất bản :&nbsp;' + book.publishing_company + ' </div>' +
        '            <div>Số lượng : &nbsp;' + book.quantity + '</div>' +
        '            <div>Đơn giá :&nbsp;' + book.unit_price + ' </div>' +
        '            <div>Người nhập:&nbsp;' + book.user + ' </div>' +
        '            <div>Tổng tiền : &nbsp;' + book.total_price + '</div>' +
        '            <div>Ngày xuất bản : &nbsp;' + book.date_publish + ' </div>' +
        '            <div>Hiện đang có : &nbsp;' + book.existent + '</div>';
}