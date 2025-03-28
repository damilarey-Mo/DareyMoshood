import { forwardRef } from 'react';
import { classes } from '~/utils/style';
import styles from './monogram.module.css';
import logo from '~/assets/logo.svg';

export const Monogram = forwardRef(({ highlight, className, ...props }, ref) => {
  return (
    <div className={classes(styles.monogram, className)} ref={ref} {...props}>
      <img src={logo} alt="Logo" width="60" height="60" />
      {highlight && (
        <div className={styles.highlight}></div>
      )}
    </div>
  );
});