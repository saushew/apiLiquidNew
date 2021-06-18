async function changeSettings() {
  document.getElementById("submitButton").style.display = "none";
  let form = document.getElementById("Form").elements;
  let type = encodeURIComponent(form.namedItem("type").value);
  let price = encodeURIComponent(form.namedItem("price").value);
  let pair = encodeURIComponent(form.namedItem("pair").value);
  let amount = encodeURIComponent(form.namedItem("amount").value);
  let maxamountpt = encodeURIComponent(form.namedItem("maxamountpt").value);
  let minutesUntilReaching = encodeURIComponent(form.namedItem("minutesUntilReaching").value);

  let query =
    "type=" + type + "&price=" + price + "&amount=" + amount + "&maxamountpt=" + maxamountpt + "&pair=" + pair + "&minutesUntilReaching=" + minutesUntilReaching;

  let response;
  try {
    if (document.getElementById("submitButton").innerHTML.includes("run")) {
      response = await fetch(
        "/api/buySellBot?auth=" + localStorage.getItem("auth") + "&" + query
      );
    } else {
      response = await fetch(
        "/api/stop_buySellBot?auth=" + localStorage.getItem("auth") + "&pair=" + pair
      );
    }
  } catch (e) {
    document.getElementById("failed").style.display = "block";
    document.getElementById("success").style.display = "none";
    return;
  }
  if (response.status == 200) {
    document.getElementById("failed").style.display = "none";
    document.getElementById("success").style.display = "block";

    setTimeout(function() {
      document.location.href = "";
    }, 5000);
    let text = await response.text();
    alert(text);
  } else {
    document.getElementById("failed").style.display = "block";
  }
}

var isPaused = false;

window.onfocus = async function() {
  isPaused = false;
  syncInfo();
};

window.onblur = async function() {
  isPaused = true;
};
let prevRunning = false;
async function syncInfo() {
  await FetchTableData(false);
  let settings = JSON.parse(localStorage.getItem(settingsPlace));
  document.querySelector("#status").innerHTML = JSON.stringify(
    settings.buySellBot,
    undefined,
    2
  );
  if (
    settings.buySellBot.running != prevRunning ||
    document.getElementById("submitButton").style.display == "none"
  ) {
    prevRunning = settings.buySellBot.running
    document.getElementById("submitButton").style.display = "none";
    if (settings.buySellBot.running == true) {
      setTimeout(function() {
        document.getElementById("submitButton").innerHTML = "stop bot";
        document.getElementById("submitButton").style.display = "block";
      }, 2000);
    } else {
      setTimeout(function() {
        document.getElementById("submitButton").innerHTML = "run bot";
        document.getElementById("submitButton").style.display = "block";
      }, 2000);
    }
  }
}
async function main() {
  document.getElementById("submitButton").style.display = "none";
  if (!(await testAuth())) {
    document.location.href =
      "/authenticate?goto=" + btoa(document.location.href);
  }

  syncInfo();

  setInterval(syncInfo, 4500);
}

document.addEventListener("DOMContentLoaded", main);
