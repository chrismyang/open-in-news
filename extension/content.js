// Apple News+ publisher domains
const PUBLISHERS = [
  "architecturaldigest.com",
  "bicycling.com",
  "billboard.com",
  "bonappetit.com",
  "cntraveler.com",
  "cosmopolitan.com",
  "curbed.com",
  "elle.com",
  "epicurious.com",
  "esquire.com",
  "ew.com",
  "foodandwine.com",
  "fortune.com",
  "glamour.com",
  "goodhousekeeping.com",
  "gq.com",
  "grubstreet.com",
  "harpersbazaar.com",
  "health.com",
  "hollywoodreporter.com",
  "instyle.com",
  "intelligencer.com",
  "latimes.com",
  "macstories.net",
  "macworld.com",
  "marthastewart.com",
  "menshealth.com",
  "nationalgeographic.com",
  "newyorker.com",
  "nymag.com",
  "parents.com",
  "pcworld.com",
  "people.com",
  "pitchfork.com",
  "popularmechanics.com",
  "prevention.com",
  "realsimple.com",
  "rollingstone.com",
  "runnersworld.com",
  "self.com",
  "sfchronicle.com",
  "si.com",
  "slate.com",
  "techhive.com",
  "techmeme.com",
  "teenvogue.com",
  "theatlantic.com",
  "thecut.com",
  "them.com",
  "time.com",
  "townandcountrymag.com",
  "travelandleisure.com",
  "usatoday.com",
  "usweekly.com",
  "vanityfair.com",
  "vogue.com",
  "vulture.com",
  "wired.com",
  "womenshealthmag.com",
  "wsj.com",
];

function isPublisherSite() {
  const hostname = window.location.hostname.replace(/^www\./, "");
  return PUBLISHERS.some(
    (pub) => hostname === pub || hostname.endsWith("." + pub)
  );
}

function createBanner() {
  if (document.getElementById("open-in-news-banner")) return;

  const banner = document.createElement("div");
  banner.id = "open-in-news-banner";
  banner.innerHTML = `
    <span class="open-in-news-text">This article may be available in Apple News+</span>
    <button id="open-in-news-btn">Open in Apple News</button>
    <button id="open-in-news-dismiss">&times;</button>
  `;
  document.body.prepend(banner);

  document.getElementById("open-in-news-btn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "openInNews", url: window.location.href });
    banner.remove();
  });

  document.getElementById("open-in-news-dismiss").addEventListener("click", () => {
    banner.remove();
    // Remember dismissal for this session
    sessionStorage.setItem("open-in-news-dismissed", "true");
  });
}

if (isPublisherSite() && !sessionStorage.getItem("open-in-news-dismissed")) {
  createBanner();
}
