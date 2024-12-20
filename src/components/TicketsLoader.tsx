import React from 'react'
import styles from '@/styles/loading.module.css'

const TicketsLoader = () => {
    return (
        <div className={styles.loader_parent}><div className={styles.Tspinner}></div></div>
    )
}

export default TicketsLoader