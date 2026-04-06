"use client";

import { useCallback, useEffect, useRef } from "react";

type ScrollspyProps = {
  children: React.ReactNode;
  targetRef?: React.RefObject<
    HTMLElement | HTMLDivElement | Document | null | undefined
  >;
  onUpdate?: (id: string) => void;
  offset?: number;
  smooth?: boolean;
  className?: string;
  dataAttribute?: string;
  history?: boolean;
  throttleTime?: number;
};

export function Scrollspy({
  children,
  targetRef,
  onUpdate,
  className,
  offset = 0,
  smooth = true,
  dataAttribute = "scrollspy",
  history = true,
}: ScrollspyProps) {
  const selfRef = useRef<HTMLDivElement | null>(null);
  const anchorElementsRef = useRef<Element[] | null>(null);
  const prevIdTracker = useRef<string | null>(null);

  const setActiveSection = useCallback(
    (sectionId: string | null, force = false) => {
      if (!sectionId) return;

      anchorElementsRef.current?.forEach((item) => {
        const id = item.getAttribute(`data-${dataAttribute}-anchor`);
        if (id === sectionId) item.setAttribute("data-active", "true");
        else item.removeAttribute("data-active");
      });

      if (onUpdate) onUpdate(sectionId);

      if (history && (force || prevIdTracker.current !== sectionId))
        window.history.replaceState({}, "", `#${sectionId}`);

      prevIdTracker.current = sectionId;
    },
    [dataAttribute, history, onUpdate],
  );

  const handleScroll = useCallback(() => {
    if (!anchorElementsRef.current || anchorElementsRef.current.length === 0)
      return;

    let scrollElement: HTMLElement | Window;

    if (!targetRef?.current || targetRef.current === document)
      scrollElement = window;
    else scrollElement = targetRef.current as HTMLElement;

    const scrollTop =
      scrollElement === window
        ? window.scrollY
        : (scrollElement as HTMLElement).scrollTop;

    let activeIdx = 0;
    let minDelta = Infinity;

    anchorElementsRef.current.forEach((anchor, idx) => {
      const sectionId = anchor.getAttribute(`data-${dataAttribute}-anchor`);
      const sectionElement = document.getElementById(sectionId!);
      if (!sectionElement) return;

      let customOffset = offset;
      const dataOffset = anchor.getAttribute(`data-${dataAttribute}-offset`);
      if (dataOffset) customOffset = parseInt(dataOffset, 10);

      const sectionTop =
        scrollElement === window
          ? sectionElement.getBoundingClientRect().top + window.scrollY
          : sectionElement.offsetTop;

      const delta = Math.abs(sectionTop - customOffset - scrollTop);

      if (sectionTop - customOffset <= scrollTop && delta < minDelta) {
        minDelta = delta;
        activeIdx = idx;
      }
    });

    const scrollHeight =
      scrollElement === window
        ? document.documentElement.scrollHeight
        : (scrollElement as HTMLElement).scrollHeight;

    const clientHeight =
      scrollElement === window
        ? window.innerHeight
        : (scrollElement as HTMLElement).clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 2)
      activeIdx = anchorElementsRef.current.length - 1;

    const activeAnchor = anchorElementsRef.current[activeIdx];
    const sectionId =
      activeAnchor?.getAttribute(`data-${dataAttribute}-anchor`) || null;

    setActiveSection(sectionId);
  }, [targetRef, dataAttribute, offset, setActiveSection]);

  const scrollTo = useCallback(
    (anchorElement: HTMLElement) => (event?: Event) => {
      if (event) event.preventDefault();

      const sectionId =
        anchorElement
          .getAttribute(`data-${dataAttribute}-anchor`)
          ?.replace("#", "") || null;

      if (!sectionId) return;

      const sectionElement = document.getElementById(sectionId);
      if (!sectionElement) return;

      let scrollToElement: HTMLElement | Window;

      if (!targetRef?.current || targetRef.current === document)
        scrollToElement = window;
      else scrollToElement = targetRef.current as HTMLElement;

      let customOffset = offset;

      const dataOffset = anchorElement.getAttribute(
        `data-${dataAttribute}-offset`,
      );

      if (dataOffset) customOffset = parseInt(dataOffset, 10);

      const top =
        scrollToElement === window
          ? sectionElement.getBoundingClientRect().top +
            window.scrollY -
            customOffset
          : sectionElement.offsetTop - customOffset;

      scrollToElement.scrollTo({
        top,
        left: 0,
        behavior: smooth ? "smooth" : "auto",
      });

      setActiveSection(sectionId, true);
    },
    [dataAttribute, offset, smooth, targetRef, setActiveSection],
  );

  const scrollToHashSection = useCallback(() => {
    const hash = CSS.escape(window.location.hash.replace("#", ""));

    if (hash) {
      const targetElement = document.querySelector(
        `[data-${dataAttribute}-anchor="${hash}"]`,
      ) as HTMLElement;

      if (targetElement) scrollTo(targetElement)();
    }
  }, [dataAttribute, scrollTo]);

  useEffect(() => {
    if (selfRef.current) {
      anchorElementsRef.current = Array.from(
        selfRef.current.querySelectorAll(`[data-${dataAttribute}-anchor]`),
      );
    }

    const currentAnchors = anchorElementsRef.current;

    currentAnchors?.forEach((item) => {
      item.addEventListener("click", scrollTo(item as HTMLElement));
    });

    const onScroll = () => handleScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    const initialTimeout = setTimeout(() => {
      scrollToHashSection();
      handleScroll();
    }, 100);

    return () => {
      window.removeEventListener("scroll", onScroll);
      currentAnchors?.forEach((item) => {
        item.removeEventListener("click", scrollTo(item as HTMLElement));
      });
      clearTimeout(initialTimeout);
    };
  }, [handleScroll, dataAttribute, scrollTo, scrollToHashSection]);

  return (
    <div data-slot="scrollspy" ref={selfRef} className={className}>
      {children}
    </div>
  );
}
