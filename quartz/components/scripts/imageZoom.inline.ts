// Makes content images (those embedded with Obsidian's `![[image]]` syntax,
// rendered as plain <img> in the article body) clickable to view the original
// at full size in an overlay. This replaces the old authoring workaround of
// wrapping each embed in a link (`[![[image]]](<image>)`) inside the Markdown.

const OVERLAY_ID = "image-zoom-overlay"

function closeOverlay() {
  const overlay = document.getElementById(OVERLAY_ID)
  if (!overlay) return
  overlay.classList.remove("active")
  overlay.setAttribute("aria-hidden", "true")
}

function getOverlay(): HTMLDivElement {
  let overlay = document.getElementById(OVERLAY_ID) as HTMLDivElement | null
  if (overlay) return overlay

  overlay = document.createElement("div")
  overlay.id = OVERLAY_ID
  overlay.setAttribute("aria-hidden", "true")
  const img = document.createElement("img")
  img.alt = ""
  overlay.appendChild(img)
  document.body.appendChild(overlay)

  // The overlay lives on <body> and persists across SPA navigations, so its
  // close handlers are registered once here (not via the nav-scoped
  // addCleanup) and never torn down. A click anywhere on the overlay — the
  // backdrop or the image — closes it, as does Escape.
  overlay.addEventListener("click", closeOverlay)
  document.addEventListener("keydown", (e) => {
    if (e.key.startsWith("Esc")) closeOverlay()
  })

  return overlay
}

function openOverlay(src: string, alt: string) {
  const overlay = getOverlay()
  const img = overlay.querySelector("img") as HTMLImageElement
  img.src = src
  img.alt = alt
  overlay.classList.add("active")
  overlay.setAttribute("aria-hidden", "false")
}

function setupImageZoom() {
  closeOverlay()
  const images = [...document.querySelectorAll("article img")] as HTMLImageElement[]
  for (const img of images) {
    // Skip images that are already inside a link of their own.
    if (img.closest("a")) continue

    const handler = () => openOverlay(img.currentSrc || img.src, img.alt)
    img.classList.add("zoomable")
    img.addEventListener("click", handler)
    window.addCleanup(() => img.removeEventListener("click", handler))
  }
}

document.addEventListener("nav", setupImageZoom)
