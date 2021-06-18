
function nextTableSheet() {
  let position = JSON.parse(localStorage.getItem(positionPlace));
  if (position == null) {
    localStorage.setItem(positionPlace, `{"from":0,"to":10}`);
  } else {
    let to = position.to;
    position.to = position.to + position.to - position.from;
    position.from = to;
  }
  let orders = JSON.parse(localStorage.getItem(OrdersPlace));

  if (position.to > orders.length) {
    position.from = orders.length - (position.to - position.from);
    position.to = orders.length;
  }
  orders.ordersPrev = orders.ordersCur;
  if (orders.ordersNext.length != 0){
    orders.ordersCur = orders.ordersNext;
  }
  orders.ordersNext = [];
  localStorage.setItem(positionPlace, JSON.stringify(position));
  localStorage.setItem(OrdersPlace, JSON.stringify(orders));
  drawTable();
}

function prevTableSheet() {
  let position = JSON.parse(localStorage.getItem(positionPlace));
  if (position == null) {
    localStorage.setItem(positionPlace, `{"from":0,"to":10}`);
  } else {
    let from = position.from;
    position.from = position.from - (position.to - position.from);
    position.to = from;
    if (position.from < 0) {
      position.to = position.to - position.from;
      position.from = 0;
    }
  }
  let orders = JSON.parse(localStorage.getItem(OrdersPlace));
  orders.ordersNext = orders.ordersCur;
  if (orders.ordersPrev.length != 0){
    orders.ordersCur = orders.ordersPrev;
  }
  orders.ordersPrev = [];
  localStorage.setItem(positionPlace, JSON.stringify(position));
  localStorage.setItem(OrdersPlace, JSON.stringify(orders));
  drawTable();
}
function InitTableHeader() {
  document.querySelector("table#exchanges thead").innerHTML = `
  <tr>
  <th>count:</th>
  <th id="countOrdersTable"></th>
  <th>
  <a class="ui primary button" onclick="prevTableSheet()">
      prev
  </a>
  </th>
  <th>
  <a class="ui primary button" onclick="nextTableSheet()">
      next
  </a></th>
  <th>showed:</th><th  id="showedOrdersTable"></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th>
  </tr>
  <tr>
  <th>exchange</th>
  <th>pair</th>
  <th>success</th>
  <th>status</th>
  <th>createdAt</th>
  <th>accountName</th>
  <th>id</th>
  <th>side</th>
  <th>status</th>
  <th>createdAt</th>
  <th>price</th>
  <th>amountLeft</th>
  <th>amountRight</th>
  <th>comission</th>
  <th>exception</th>
  </tr>`;
}

function DrawTableByData(orders) {
  document.querySelector("#countOrdersTable").innerHTML = orders.length;
  let position = JSON.parse(localStorage.getItem(positionPlace));
  document.querySelector("#showedOrdersTable").innerHTML =
    position.from + ":" + position.to;
  orders = orders.ordersCur;
  var tbody = document.querySelector(`table#exchanges tbody`);
  let innerHTML = "";
  orders.forEach((order, i) => {
    let orders1 = {};
    let orders2 = {};
    if (order.orders.length > 1) {
      orders1 = order.orders[0];
      orders2 = order.orders[1];
    }
    let row = `
      <tr><td rowspan="2">${order.exchange}</td>
      <td rowspan="2">${order.left + "_" + order.right}</td>
      <td rowspan="2">${order.success}</td>
      <td rowspan="2">${order.status}</td>
      <td rowspan="2">${new Date(order.createdAt).toLocaleString()}</td>
      <td>${orders1.accountName}</td>
      <td>${orders1.idOne}</td>
      <td>${orders1.side}</td>
      <td>${orders1.status}</td>
      <td>${new Date(orders1.createdAt).toLocaleString()}</td>
      <td>${orders1.price}</td>
      <td>${orders1.amountLeft}</td>
      <td>${orders1.amountRight}</td>
      <td>${orders1.comission}</td>
      <td>${orders1.exception}</td></tr>

      <tr>
      <td>${orders2.accountName}</td>
      <td>${orders2.idOne}</td>
      <td>${orders2.side}</td>
      <td>${orders2.status}</td>
      <td>${new Date(orders2.createdAt).toLocaleString()}</td>
      <td>${orders2.price}</td>
      <td>${orders2.amountLeft}</td>
      <td>${orders2.amountRight}</td>
      <td>${orders2.comission}</td>
      <td>${orders2.exception}</td></tr>`;

    innerHTML += row;
  });
  tbody.innerHTML = innerHTML;
}

var isPaused = false;
var prevOrders = "";
window.onfocus = async function() {
  isPaused = false;
  syncTable();
};
window.onblur = async function() {
  isPaused = true;
};
function drawTable() {
  orders = localStorage.getItem(OrdersPlace);
  if (orders !== prevOrders) {
    orders = JSON.parse(orders);
    if (orders) {
      DrawTableByData(orders);
      prevOrders = orders;
    }
  }
}
async function syncTable() {
  await FetchTableData(true);
  drawTable();
}
async function main() {
  if (localStorage.getItem(positionPlace) == null) {
    localStorage.setItem(positionPlace, `{"from":0,"to":10}`);
  }
  InitTableHeader();
  drawTable();

  if (!(await testAuth())) {
    document.location.href =
      "/authenticate?goto=" + btoa(document.location.href);
  }

  syncTable();
  setInterval(syncTable, 1000);
  //setTimeout(syncTableFull, 4500);
}

document.addEventListener("DOMContentLoaded", main);
