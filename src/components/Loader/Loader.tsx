import styles from "./Loader.module.css";


export function Loader() {


    return (
        <div className={styles.loader}>
            <img
                src="/Rick_and_Morty.svg"
                alt="Loading..."
            />

        </div>
    )
}