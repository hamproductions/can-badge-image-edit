export const PAPER_SIZES = {
  a4: {
    width: 210,
    height: 297
  },
  l: {
    width: 127,
    height: 89
  },
  ['2l']: {
    width: 178,
    height: 127
  },
  postcard: {
    width: 148,
    height: 100
  },
  a6: {
    width: 148,
    height: 105
  },
  b6: {
    width: 182,
    height: 128
  }
} as const;

export type PaperSize = keyof typeof PAPER_SIZES;
