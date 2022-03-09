declare module 'bignumber.js' {
  export default class BigNumber {
    static from(value: number | BigNumber): BigNumber;
    static from(value?: BigNumber.Value | null): BigNumber | undefined;

    static sumEach: <T = any>(items: T[], predicate: (item: T) => BigNumber | undefined) => BigNumber | undefined;

    scaleBy(decimals?: number): BigNumber;

    unscaleBy(decimals?: number): BigNumber;
  }
}

export {}
