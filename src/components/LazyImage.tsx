import { useState, useRef, useEffect } from "react";

interface LazyImageProps {
    src: string;
    alt: string;
    className?: string;
    placeholderClassName?: string;
}

const LazyImage = ({ src, alt, className = "", placeholderClassName = "" }: LazyImageProps) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "100px" }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={imgRef} className={`relative ${className}`}>
            {!isLoaded && (
                <div
                    className={`absolute inset-0 bg-muted animate-pulse ${placeholderClassName}`}
                />
            )}
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    className={`${className} transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"
                        }`}
                    onLoad={() => setIsLoaded(true)}
                />
            )}
        </div>
    );
};

export default LazyImage;
