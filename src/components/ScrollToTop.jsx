import { useEffect, useState } from "react";
import { MdKeyboardDoubleArrowUp } from "react-icons/md";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  function handleScrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  function handleScroll() {
    setIsVisible(window.scrollY > 100);
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <button
      onClick={handleScrollToTop}
      className={`scroll-to-top ${isVisible ? "show" : "hide"}`}
    >
      <MdKeyboardDoubleArrowUp />
    </button>
  );
}
