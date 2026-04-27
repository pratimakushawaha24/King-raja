if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("[PWA] Service Worker registered successfully:", registration)
      })
      .catch((error) => {
        console.error("[PWA] Service Worker registration failed:", error)
      })
  })
}
