import { useEffect, useState } from "react";
import styles from "./Loader.module.css";

const scales = [1, 1.5, 2];

export function Loader() {
    const [index, setIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prew) => (prew + 1) % scales.length);
        }, 1000);
        return () => clearInterval(interval)
    }, [])

    return (
        <div className={styles.loader}>
            <img
                src="/Rick_and_Morty.svg"
                alt="Loading..."
                style={{ transform: `scale(${scales[index]})`, transition: "transform 0.5s ease-in-out" }}
            />

        </div>
    )
}