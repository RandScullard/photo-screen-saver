import styles from "./demoCss.module.scss"

export function DemoCss()
{
   return (
      <div className={styles.root}>
         {Array(200).fill(0).map((n, idx) =>
            <div key={idx} className={styles.snow}/>
         )}
      </div>
   )
}
