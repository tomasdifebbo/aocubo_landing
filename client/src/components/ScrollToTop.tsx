import { useEffect } from "react";
import { useLocation } from "wouter";

export default function ScrollToTop() {
    const [location] = useLocation();

    useEffect(() => {
        // Disable browser's automatic scroll restoration
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        // Force scroll to top on every location change AND on first mount (refresh)
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        });
    }, [location]);

    return null;
}
