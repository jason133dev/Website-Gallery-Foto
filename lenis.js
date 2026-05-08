// 1. Setup Lenis
const lenis = new Lenis({
  duration: .8,   // Berapa lama animasi scroll bertahan (detik)
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Fungsi matematika biar "licin"
  direction: 'vertical', 
  gestureDirection: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 1, 
  touchMultiplier: 2, // Biar swipe di HP lebih berasa mantul
});

// 2. Hubungkan Lenis dengan requestAnimationFrame (Logika Looping)
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

requestAnimationFrame(raf);