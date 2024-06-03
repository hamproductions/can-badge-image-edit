import { CSSProperties } from 'react';

export interface CSSPropertiesWithVars extends CSSProperties {
  [key: `--${string}`]: string | number;
}
