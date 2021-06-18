var OrdersPlace = "orders2";
var settingsPlace = "settingsStorage";
var ratePlace = "btcfeatRate";
var positionPlace = "postionPlace";

async function FetchTableData(full) {
  if (isPaused) {
    console.log("paused");
    return;
  }
  let position = JSON.parse(localStorage.getItem(positionPlace));
  let ordersOld = JSON.parse(localStorage.getItem(OrdersPlace));

  let response;
  try {
    response = await fetch(
      "/api/getOrdersAndSettings?auth=" +
        localStorage.getItem("auth") +
        "&from=" +
        position.from +
        "&to=" +
        position.to
    );
  } catch (e) {
    return;
  }

  let botLogJson = await response.text();
  let botLog = JSON.parse(botLogJson);
  let ordersGot = botLog.orders;
  let ordersGotNext = botLog.ordersNext;
  let ordersGotPrev = botLog.ordersPrev;
  let ordersLength = botLog.lenOrders;
  let settingsGot = botLog.settings;
  localStorage.setItem(settingsPlace, JSON.stringify(settingsGot));
  let orders = {
    ordersCur: ordersGot,
    ordersNext: ordersGotNext,
    ordersPrev: ordersGotPrev,
    length: ordersLength
  };
  //console.log(orders, JSON.stringify(orders))
  localStorage.setItem(OrdersPlace, JSON.stringify(orders));
}

function compareCreateTime(orderA, orderB) {
  if (orderA.stopped !== orderB.stopped) {
    if (orderA.stopped && !orderB.stopped) return 1;
    else if (!orderA.stopped && orderB.stopped) return -1;
  }
  if (orderA.createTime < orderB.createTime) return 1;
  else if (orderA.createTime > orderB.createTime) return -1;
  return 0;
}

async function getRate(left, right) {
  left = left.toUpperCase();
  right = right.toUpperCase();

  let response = await fetch(
    "https://api.coinbase.com/v2/prices/spot?base=" +
      left +
      "&currency=" +
      right
  );
  let data = await response.json();

  let allRates = JSON.parse(localStorage.getItem(ratePlace));
  if (!allRates) {
    allRates = {};
  }
  allRates[left + "_" + right] = Number(data.data.amount);
  localStorage.setItem(ratePlace, JSON.stringify(allRates));
}

async function getAllRate() {
  await getRate("BTC", "RUB");
  await getRate("BTC", "USD");
  return JSON.parse(localStorage.getItem(ratePlace));
}
