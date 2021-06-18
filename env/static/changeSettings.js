async function changeSettings() {
  document.getElementById("submitButton").style.display = "none";
  let form = document.getElementById("Form").elements;
  let stop = encodeURIComponent(form.namedItem("stop").value);
  let period = encodeURIComponent(form.namedItem("period").value);
  let mindif = encodeURIComponent(form.namedItem("mindif").value);
  let priceShiftEdge = encodeURIComponent(form.namedItem("priceShiftEdge").value);
  let priceShiftMaxOnceAmount = encodeURIComponent(form.namedItem("priceShiftMaxOnceAmount").value);
  let priceShiftMaxAmountToTrade = encodeURIComponent(form.namedItem("priceShiftMaxAmountToTrade").value);
  let volumeToTradePerDayMax = encodeURIComponent(
    form.namedItem("volumeToTradePerDayMax").value
  );
  let volumeToTradePerDayMin = encodeURIComponent(
    form.namedItem("volumeToTradePerDayMin").value
  );


  let modifyMinRightBalance = encodeURIComponent(
    form.namedItem("modifyMinRightBalance").value
  );
  let modifyMinBTCBalance = encodeURIComponent(
    form.namedItem("modifyMinBTCBalance").value
  );
  let modifyVolumeToTradePerDayMax = encodeURIComponent(
    form.namedItem("modifyVolumeToTradePerDayMax").value
  );
  let modifyVolumeToTradePerDayMin = encodeURIComponent(
    form.namedItem("modifyVolumeToTradePerDayMin").value
  );

  let buyBeforeSell = encodeURIComponent(
    form.namedItem("buyBeforeSell").value
  );
  let enabledPair = encodeURIComponent(form.namedItem("enabledPair").value);
  let pair = encodeURIComponent(form.namedItem("pair").value);

  let query =
    "stop=" +
    stop +
    "&period=" +
    period +
    "&mindif=" +
    mindif +
    "&priceShiftEdge=" +
    priceShiftEdge +
    "&priceShiftMaxOnceAmount=" +
    priceShiftMaxOnceAmount +
    "&priceShiftMaxAmountToTrade=" +
    priceShiftMaxAmountToTrade +
    "&volumeToTradePerDayMax=" +
    volumeToTradePerDayMax +
    "&volumeToTradePerDayMin=" +
    volumeToTradePerDayMin +
    "&modifyMinRightBalance=" +
    modifyMinRightBalance +
    "&modifyMinBTCBalance=" +
    modifyMinBTCBalance +
    "&modifyVolumeToTradePerDayMax=" +
    modifyVolumeToTradePerDayMax +
    "&modifyVolumeToTradePerDayMin=" +
    modifyVolumeToTradePerDayMin +
    "&buyBeforeSell=" +
    buyBeforeSell +
    "&enabledPair=" +
    enabledPair +
    "&pair=" +
    pair;

  let response;
  try {
    response = await fetch(
      "/api/changeSettings?auth=" + localStorage.getItem("auth") + "&" + query
    );
  } catch (e) {
    document.getElementById("failed").style.display = "block";
    document.getElementById("success").style.display = "none";
    return;
  }
  if (response.status == 200) {
    document.getElementById("failed").style.display = "none";
    document.getElementById("success").style.display = "block";

    setTimeout(function () {
      document.location.href = "";
    }, 5000);
    let text = await response.text();
    alert(text);
  } else {
    document.getElementById("failed").style.display = "block";
  }
}
document.addEventListener("DOMContentLoaded", async function (event) {
  if (!(await testAuth())) {
    document.location.href =
      "/authenticate?goto=" + btoa(document.location.href);
  }
});
