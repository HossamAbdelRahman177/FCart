import { Outlet } from "react-router-dom";
import { Navbar, Footer, ScrollToTop } from "components";
import toast, { Toaster } from "react-hot-toast";
import { FaWifi } from "react-icons/fa";
import { MdWifiOff } from "react-icons/md";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    function handleOnline() {
      toast(
        () =>
          navigator.onLine ? (
            <span className="d-flex align-items-center gap-2 fs-6">
              <FaWifi className="wifi__icon text-success fw-bold" />
              Back online.
            </span>
          ) : (
            <span className="d-flex align-items-center gap-2 fs-6">
              <MdWifiOff className="wifi__icon text-secondary fw-bold" />
              You're offline right now. Check your connection.
            </span>
          ),
        {
          position: "bottom-left",
        }
      );
    }
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOnline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOnline);
    };
  }, []);
  return (
    <>
      <Navbar />
      <Outlet />
      <ScrollToTop />
      <Footer />
      <Toaster
        position="bottom-right"
        reverseOrder={false}
        className="toaster"
      />
    </>
  );
}
