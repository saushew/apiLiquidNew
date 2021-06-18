async function testAuth() {
  if (localStorage.getItem("auth") !== null) {
    try {
      response = await fetch(
        "/api/test_auth?auth=" + localStorage.getItem("auth")
      );
      if (response.status == 200) {
        return true;
      }
    } catch (e) {}
  }
  return false;
}
