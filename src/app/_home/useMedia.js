import { useSyncExternalStore } from "react";

// بيرجع true لو الـ media query متحققة. على السيرفر false (من غير hydration mismatch)
export default function useMedia(query) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(query);
      m.addEventListener("change", cb);
      return () => m.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
