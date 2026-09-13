"use client";

import { useEffect, useRef } from "react";

export default function ScrollEffects() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reveal animasyonu: .reveal sınıflı elemanlar ekrana girince görünür olur
    const revealEls = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));

    // Storyteller bölümü: kutular kaydırdıkça belirir, ama sonsuz döngü
    // başa sarıp bu kutular tekrar ekrana girdiğinde animasyon yeniden
    // oynasın diye (yukarıdaki .reveal'ın aksine) hiçbir zaman unobserve
    // edilmiyor — kesişim durumu her değiştiğinde sınıf ekleniyor/kaldırılıyor.
    const storyEls = document.querySelectorAll(".story-reveal");
    const storyObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          entry.target.classList.toggle("is-visible", entry.isIntersecting);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -80px 0px" }
    );
    storyEls.forEach((el) => storyObserver.observe(el));

    // Gerçek sonsuz döngü: içerik (main+footer) iki kez render ediliyor
    // (bkz. page.tsx, #loop-copy-0 / #loop-copy-1). Kullanıcı ilk kopyanın
    // sonuna gelince, scroll pozisyonundan sessizce bir kopya yüksekliği
    // düşülüyor — ikinci kopya birebir aynı olduğu için görsel olarak hiçbir
    // sıçrama/animasyon hissedilmiyor, sonsuz kayan bir şerit gibi davranıyor.
    const firstCopy = document.getElementById("loop-copy-0");
    let copyHeight = 0;

    function measure() {
      copyHeight = firstCopy?.getBoundingClientRect().height ?? 0;
    }
    measure();

    const resizeObserver = firstCopy ? new ResizeObserver(measure) : null;
    if (firstCopy && resizeObserver) resizeObserver.observe(firstCopy);
    // Fontlar/görseller yerleşene kadar birkaç kez yeniden ölç
    const remeasureTimers = [100, 500, 1200].map((ms) => window.setTimeout(measure, ms));

    function updateProgressBar(scrollTop: number) {
      const progress = copyHeight > 0 ? (scrollTop % copyHeight) / copyHeight : 0;
      if (barRef.current) {
        barRef.current.style.width = `${progress * 100}%`;
      }
    }

    // Arka plan görseli kaydırdıkça aksın (parallax): görsel döşenmediği
    // (no-repeat + cover) için hiçbir dikiş/kesik oluşmuyor — katman,
    // görünür alandan %6 taşacak şekilde büyütülüp (bkz. .bg-layer inset)
    // bu taşan payın içinde ileri-geri salınım (sinüs) ile kaydırılıyor.
    // Sonsuz döngünün "sessiz" scroll sıçramaları da bu akışa yansımasın
    // diye mutlak scroll yerine gerçek kullanıcı hareketinin toplamı
    // (delta) kullanılıyor.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bgBase = document.getElementById("bg-layer-base");
    const bgMultiply = document.getElementById("bg-layer-multiply");
    let lastRawScrollY = window.scrollY;
    let totalScrolled = 0;
    const MAX_PAN_PX = 46;
    const PERIOD_PX = 2600;

    function updateParallax() {
      if (reduceMotion) return;
      const baseOffset = Math.sin((totalScrolled / PERIOD_PX) * Math.PI * 2) * MAX_PAN_PX;
      const multiplyOffset = Math.sin((totalScrolled / (PERIOD_PX * 0.7) + 1.3) * Math.PI * 2) * (MAX_PAN_PX * 0.7);
      if (bgBase) bgBase.style.transform = `translate3d(0, ${baseOffset.toFixed(1)}px, 0)`;
      if (bgMultiply) bgMultiply.style.transform = `translate3d(0, ${multiplyOffset.toFixed(1)}px, 0)`;
    }

    function handleScroll() {
      const scrollTop = window.scrollY;
      totalScrolled += scrollTop - lastRawScrollY;
      lastRawScrollY = scrollTop;
      updateParallax();

      if (copyHeight > window.innerHeight * 1.5 && scrollTop >= copyHeight) {
        window.scrollTo(0, scrollTop - copyHeight);
        lastRawScrollY = scrollTop - copyHeight;
        return;
      }
      updateProgressBar(scrollTop);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    const raf = requestAnimationFrame(() => updateProgressBar(window.scrollY));

    return () => {
      observer.disconnect();
      storyObserver.disconnect();
      resizeObserver?.disconnect();
      remeasureTimers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[3px] bg-white/10">
      <div
        ref={barRef}
        className="h-full w-0 bg-gradient-to-r from-[#cc0621] via-[#5f06cc] to-[#063ecc] transition-[width] duration-150 ease-out"
      />
    </div>
  );
}
