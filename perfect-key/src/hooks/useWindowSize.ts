import { useState, useEffect } from 'react';

interface WindowSize {
    width: number;
    height: number
}
function useWindowSize(): string {
    // Initialize state with undefined width/height so server and client renders match
    // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
    const [windowSize, setWindowSize] = useState<WindowSize>({
        width: 0,
        height: 0,
    });
    useEffect(() => {
        // Handler to call on window resize
        function handleResize() {
            // Set window width/height to state
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }
        // Add event listener
        window.addEventListener("resize", handleResize);
        // Call handler right away so state gets updated with initial window size
        handleResize();
        // Remove event listener on cleanup
        return () => window.removeEventListener("resize", handleResize);
    }, []); // Empty array ensures that effect is only run on mount
    if (windowSize.width >= 1536)
        return '2xl';
    if (windowSize.width >= 1280)
        return 'xl';
    if (windowSize.width >= 1024)
        return 'lg';
    if (windowSize.width >= 768)
        return 'md';
    return "sm"
}

export default useWindowSize;