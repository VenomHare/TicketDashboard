import React from 'react'
import styles from "@/styles/loading.module.css"
const Loading = () => {
    return (
        <div className={styles.spinnerContainer}>
            <div className={styles.spinner}></div>
        </div>
    )
}

export default Loading