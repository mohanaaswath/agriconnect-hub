import { useEffect, useState, useRef } from "react";

export function GateOpening() {
  const [entered, setEntered] = useState(false);
  const [open, setOpen] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [exiting, setExiting] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const enterSiteRef = useRef<() => void>(() => {});

  const enterSite = () => {
    setExiting(true);
    document.body.style.overflow = "auto";
    setTimeout(() => {
      setEntered(true);
    }, 1000);
  };
  enterSiteRef.current = enterSite;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const openTimer = setTimeout(() => setOpen(true), 1500);
    const buttonTimer = setTimeout(() => setShowButton(true), 2000);
    const autoEnterTimer = setTimeout(() => {
      enterSiteRef.current?.();
    }, 2500);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(buttonTimer);
      clearTimeout(autoEnterTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (entered) return null;

  return (
    <div className={`gate-scene ${exiting ? "gate-scene-exit" : ""}`} aria-hidden="false">
      <div className="gate-sun" />
      <div className="gate-birds">
        <div className="gate-bird" />
        <div className="gate-bird" />
        <div className="gate-bird" />
      </div>

      <p className="gate-welcome-text">வருக வருக · Welcome</p>

      <div ref={wrapperRef} className={`gate-wrapper ${open ? "gate-open" : ""}`}>
        <div className="gate-pillar gate-pillar-left" />
        <div className="gate-pillar gate-pillar-right" />

        <div className="gate-arch">
          <div className="gate-arch-sign">
            <div className="gate-farm-name">DHANDAPANI</div>
            <div className="gate-farm-sub">FARM · MUTHUR</div>
          </div>
        </div>

        <div className="gate-door gate-door-left">
          <div className="gate-knob gate-knob-left" />
        </div>
        <div className="gate-door gate-door-right">
          <div className="gate-knob gate-knob-right" />
        </div>

        <button
          type="button"
          className={`gate-enter-btn ${showButton ? "gate-enter-btn-show" : ""}`}
          onClick={enterSite}
        >
          🚜 உள்ளே வாருங்கள்
        </button>
      </div>

      <div className="gate-ground" />
    </div>
  );
}
