async function changeSettings() {
  document.getElementById("submitButton").style.display = "none";
  let form = document.getElementById("Form").elements;
  let period1 = encodeURIComponent(form.namedItem("period1").value);
  let maxPrice = encodeURIComponent(form.namedItem("maxPrice").value);
  let minPrice = encodeURIComponent(form.namedItem("minPrice").value);
  let minAmount = encodeURIComponent(form.namedItem("minAmount").value);
  let maxAmount = encodeURIComponent(form.namedItem("maxAmount").value);
  let sectorSize = encodeURIComponent(form.namedItem("sectorSize").value);
  let notPlaceDiff = encodeURIComponent(form.namedItem("notPlaceDiff").value);

  let precisionAmount = encodeURIComponent(
    form.namedItem("precisionAmount").value
  );

  let precisionPrice = encodeURIComponent(
    form.namedItem("precisionPrice").value
  );

  let enabledPair = encodeURIComponent(form.namedItem("enabledPair").value);
  let pair = encodeURIComponent(form.namedItem("pair").value);

  let query =
    "stop=" +
    stop +
    "&period1=" +
    period1 +
    "&maxPrice=" +
    maxPrice +
    "&minPrice=" +
    minPrice +
    "&minAmount=" +
    minAmount +
    "&maxAmount=" +
    maxAmount +
    "&sectorSize=" +
    sectorSize +
    "&notPlaceDiff=" +
    notPlaceDiff +
    "&precisionAmount=" +
    precisionAmount +
    "&precisionPrice=" +
    precisionPrice +
    "&enabledPair=" +
    enabledPair +
    "&pair=" +
    pair;

  let response;
  try {
    response = await fetch(
      "/api/changeSettingsSpreadFill?auth=" +
        localStorage.getItem("auth") +
        "&" +
        query
    );
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
document.addEventListener("DOMContentLoaded", async function(event) {
  if (!(await testAuth())) {
    document.location.href =
      "/authenticate?goto=" + btoa(document.location.href);
  }
});
