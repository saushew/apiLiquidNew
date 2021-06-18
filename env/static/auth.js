function sha256(str) {
  // We transform the string into an arraybuffer.
  var buffer = new TextEncoder("utf-8").encode(str);
  return crypto.subtle.digest("SHA-256", buffer).then(function(hash) {
    return hex(hash);
  });
}

function hex(buffer) {
  var hexCodes = [];
  var view = new DataView(buffer);
  for (var i = 0; i < view.byteLength; i += 4) {
    // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
    var value = view.getUint32(i);
    // toString(16) will give the hex representation of the number without padding
    var stringValue = value.toString(16);
    // We use concatenation and slice for padding
    var padding = "00000000";
    var paddedValue = (padding + stringValue).slice(-padding.length);
    hexCodes.push(paddedValue);
  }

  // Join all the hex strings into one
  return hexCodes.join("");
}

async function auth() {
  let form = document.getElementById("authform").elements;
  let user = form.namedItem("user").value;
  let password = form.namedItem("password").value;
  let salt =
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15);
  let hash = (await sha256(user + password + salt)) + "__" + salt;
  let response;
  try {
    response = await fetch("/api/test_auth?auth=" + hash);
  } catch (e) {
    document.getElementById("failedLog").style.display = "block";
    return;
  }
  if (response.status == 200) {
    localStorage.setItem("auth", hash);
    localStorage.setItem("user", user);

    document.getElementById("failedLog").style.display = "none";

    var urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("goto")) {
      document.location.href = atob(urlParams.get("goto"));
    } else {
      document.location.href = "/";
    }
  } else {
    document.getElementById("failedLog").style.display = "block";
  }
}
document.addEventListener("DOMContentLoaded", async function(event) {
  if (await testAuth()) {
    var urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("goto")) {
      document.location.href = atob(urlParams.get("goto"));
    } else {
      document.location.href = "/";
    }
  }
});
