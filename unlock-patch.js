// ============================================================
// STEPCAST UNLOCK PATCH
// Replace the unlock-related JS in any tour HTML with this.
// Change STORAGE_KEY and FREE_STOPS per city as needed.
// Remove UNLOCK_CODE entirely — no longer needed.
// ============================================================

var FREE_STOPS = 3;
var STORAGE_KEY = "stepcast_val_v4"; // change per city e.g. stepcast_sev_v4

function isUnlocked() {
  try { return localStorage.getItem(STORAGE_KEY) === "1"; } catch(e) { return false; }
}

function unlockTour() {
  try { localStorage.setItem(STORAGE_KEY, "1"); } catch(e) {}
  var locks = document.querySelectorAll(".lock-overlay");
  for (var i = 0; i < locks.length; i++) locks[i].remove();
  var ndots = document.querySelectorAll(".ndot");
  for (var i = 0; i < ndots.length; i++) { ndots[i].style.opacity = "1"; ndots[i].title = ""; }
  closeModal();
}

// Called when user types a code manually and clicks Apply
function tryCode() {
  var val = document.getElementById("ucodeIn").value.trim();
  var msg = document.getElementById("umsg");
  if (!val) { msg.textContent = "Please enter a code."; msg.className = "umsg er"; return; }
  msg.textContent = "Checking...";
  msg.className = "umsg";
  verifyKey(val, function(ok, errMsg) {
    if (ok) {
      msg.textContent = "Code accepted. Unlocking your tour...";
      msg.className = "umsg ok";
      setTimeout(unlockTour, 800);
    } else {
      msg.textContent = errMsg || "Invalid code. Check your email and try again.";
      msg.className = "umsg er";
    }
  });
}

// Calls api/verify.js with the key, returns result via callback
function verifyKey(key, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/api/verify", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (xhr.readyState !== 4) return;
    try {
      var data = JSON.parse(xhr.responseText);
      if (data.valid === true) {
        callback(true, null);
      } else {
        callback(false, data.error || "Invalid code.");
      }
    } catch(e) {
      callback(false, "Verification failed. Please try again.");
    }
  };
  xhr.onerror = function() { callback(false, "Network error. Please try again."); };
  xhr.send(JSON.stringify({ key: key }));
}

// Runs on page load — checks if ?key= is in the URL from LS redirect
function autoUnlockFromUrl() {
  if (isUnlocked()) return;
  var search = window.location.search;
  if (!search) return;
  var match = search.match(/[?&]key=([^&]+)/);
  if (!match) return;
  var key = decodeURIComponent(match[1]);
  if (!key) return;
  verifyKey(key, function(ok) {
    if (ok) {
      unlockTour();
      // Clean the key out of the URL bar without reloading
      try {
        var clean = window.location.pathname;
        window.history.replaceState({}, document.title, clean);
      } catch(e) {}
    }
  });
}

function openModal() { document.getElementById("umodal").classList.add("show"); }
function closeModal() { document.getElementById("umodal").classList.remove("show"); }

document.getElementById("ucodeIn").addEventListener("keydown", function(e) {
  if (e.key === "Enter") tryCode();
});

function applyLocks() {
  if (isUnlocked()) return;
  var allStops = document.querySelectorAll(".stop");
  for (var i = 0; i < allStops.length; i++) {
    if (i < FREE_STOPS) continue;
    allStops[i].style.position = "relative";
    var o = document.createElement("div");
    o.className = "lock-overlay";
    o.innerHTML = "<div class='lock-icon'>&#128274;</div><h4>Stop " + (i + 1) + " is locked</h4><p>Unlock the full tour to hear all stops with GPS navigation and narrated audio.</p><button class='unlock-btn' onclick='openModal()'>Unlock Full Tour</button>";
    allStops[i].appendChild(o);
    var ndots = document.querySelectorAll(".ndot");
    if (ndots[i]) { ndots[i].style.opacity = "0.35"; ndots[i].title = "Locked"; }
  }
}

// Run on load
autoUnlockFromUrl();
setTimeout(applyLocks, 300);
