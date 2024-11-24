import React, { useEffect, useState } from "react";

function useWindowSize() {
    const [windowSize, setWindowSize] = useState(getWindowSize());

    function getWindowSize() {
        const { innerWidth: width } = window;
        if (width >= 1920) {
            return "xl";
        } else if (width >= 1280) {
            return "lg";
        } else if (width >= 960) {
            return "md";
        } else if (width >= 600) {
            return "sm";
        } else {
            return "xs";
        }
    }

    useEffect(() => {
        function handleResize() {
            setWindowSize(getWindowSize());
        }

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowSize;
}

export default useWindowSize;