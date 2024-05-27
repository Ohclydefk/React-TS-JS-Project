import { useState, useEffect } from "react";

const ScrollUp = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowScrollButton(scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div
      className={`scroll-to-top ${showScrollButton ? "show" : ""}`}
      onClick={scrollToTop}
      title="Scroll to Top"
      style={{
        bottom: "50px",
        right: "20px",
        color: "white",
        backgroundColor: "black",
        padding: "10px",
        borderRadius: "50%",
        cursor: "pointer",
        position: "fixed",
        zIndex: 1000,
      }}
    >
      <i className="fa fa-arrow-up"></i>
    </div>
  );
};

export default ScrollUp;
