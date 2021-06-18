let prevTableContent = "";

function writeInvestorsProfit() {
  let orders = JSON.parse(localStorage.getItem(OrdersPlace));
  let settings = JSON.parse(localStorage.getItem(settingsPlace));
  let rates = JSON.parse(localStorage.getItem(ratePlace));
  let user = localStorage.getItem("user");
  if (!orders || !settings || !rates) {
    return;
  }

  let investorsProfit = getInvestorsProfit(orders);
  let investorsProfitAllorders = getInvestorsProfitAllOrders(orders);

  let tableContent = ``;
  let binanceBalance = 0;
  for (investor in investorsProfit) {
    if (user == investor || user == "vlad" || user == "lesha") {
      InvestorRow = getInvestorRow(
        investor,
        investorsProfit,
        investorsProfitAllorders,
        settings,
        rates
      );
      tableContent += InvestorRow;
      //binanceBalance += Number(investorsProfit[investor].free)
      binanceBalance += Number(investorsProfitAllorders[investor].free);
    }
  }
  for (investorAccount of settings.investors) {
    for (date in investorAccount.invested) {
      binanceBalance += Number(investorAccount.invested[date]);
    }
  }
  if (user == "vlad" || user == "lesha") {
    tableContent =
      `<tr><td>estimated binance balance</td><td>${getAllCurrenciesAmount(
        binanceBalance,
        rates
      )}</td></tr>` + tableContent;
  }

  tableContent = tableContent;
  if (prevTableContent != tableContent) {
    document.getElementById("UsersDataTable").innerHTML = tableContent;
    prevTableContent = tableContent;
  }
}
function getAllCurrenciesAmount(amount, rates) {
  return `<pre style="margin:0px;">${Number(amount).toFixed(8)} BTC
<font color="FFC300">${(amount * rates["BTC_USD"]).toFixed(0)} USD</font>
<font color="00FFC3">${(amount * rates["BTC_RUB"]).toFixed(
    0
  )} RUB</font></pre>`;
}

function getInvestorRow(
  investor,
  investorsProfit,
  investorsProfitAllorders,
  settings,
  rates
) {
  let deposit = Number(investorsProfit[investor].free);
  let depositHistory = "";
  for (investorAccount of settings.investors) {
    if (investorAccount.name == investor) {
      for (date in investorAccount.invested) {
        deposit += Number(investorAccount.invested[date]);
      }
      depositHistory = investorAccount.invested;
    }
  }
  let deposits = "";
  for (dateISO in depositHistory) {
    var d = new Date(dateISO);
    var ds = d.toDateString();
    deposits += ds + ": " + depositHistory[dateISO] + " BTC\n";
  }
  if (deposits.length > 0) {
    deposits = deposits.slice(0, deposits.length - 1);
  }

  return `
  <tr>
    <td>${investor}</td>
    <td>
      ${getAllCurrenciesAmount(investorsProfit[investor].free, rates)}
    </td>
    <td>
      ${getAllCurrenciesAmount(deposit, rates)}
    </td>
    <td>
      ${getAllCurrenciesAmount(investorsProfit[investor].locked, rates)}
    </td>
    <td>
      ${getAllCurrenciesAmount(investorsProfitAllorders[investor].free, rates)}
    </td>
    <td>
      <pre style="margin:0px;">${deposits}</pre>
    </td>
  </tr>`;
}

var isPaused = false;

window.onfocus = async function() {
  isPaused = false;
  syncInfo();
};

window.onblur = async function() {
  isPaused = true;
};
async function syncInfo() {
  await FetchTableData(false);
  let settings = JSON.parse(localStorage.getItem(settingsPlace));
  document.querySelector("#infoPlace").innerHTML = JSON.stringify(
    settings,
    undefined,
    2
  );
}

async function main() {
  if (!(await testAuth())) {
    document.location.href =
      "/authenticate?goto=" + btoa(document.location.href);
  }
  syncInfo();

  setInterval(syncInfo, 1000);
}

document.addEventListener("DOMContentLoaded", main);
