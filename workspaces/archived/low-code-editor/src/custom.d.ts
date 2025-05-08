declare module "*.svg"
declare module "*.json"
declare module "react-draft-wysiwyg"
declare module "draft-js"
declare module "draftjs-to-html"

declare module 'react-flame-graph' {
  export class FlameGraph extends React.Component<RawData & any, any> {
  }

  export type RawData = {
    backgroundColor?: string,
    color?: string,
    children?: RawData[],
    id?: string,
    name: string,
    tooltip?: string,
    uid?: any,
    value: number,
  };

  export type ChartNode = {
    backgroundColor: string,
    color: string,
    depth: number,
    left: number,
    name: string,
    source: RawData,
    tooltip?: string,
    width: number,
  };

  export type ChartData = {
    height: number,
    levels: any[][],
    nodes: { [uid: string]: ChartNode },
    root: any,
  };

  export type ItemData = {
    data: ChartData,
    disableDefaultTooltips: boolean,
    focusedNode: ChartNode,
    focusNode: (chartNode: ChartNode, uid: any) => void,
    // handleMouseEnter: (event: SyntheticMouseEvent<*>, node: RawData) => void,
    // handleMouseLeave: (event: SyntheticMouseEvent<*>, node: RawData) => void,
    // handleMouseMove: (event: SyntheticMouseEvent<*>, node: RawData) => void,
    scale: (value: number) => number,
  };
}

declare module 'blakejs' {
  type Context = {
    b: Uint8Array,
    h: Uint32Array,
    t: number,
    c: number,
    outlen: number
  }

  type Data = Buffer | Uint8Array | string

  type Key = Uint8Array | null

  export const blake2b: (data: Data, key?: Key, outlen?: number) => Uint8Array

  export const blake2bFinal: (context: Context) => Uint8Array

  export const blake2bHex: (data: Data, key?: Key, outlen?: number) => string

  export const blake2bInit: (outlen?: number, key?: Key) => Context

  export const blake2bUpdate: (context: Context, data: Data) => void

  export const blake2s: (data: Data, key?: Key, outlen?: number) => Uint8Array

  export const blake2sFinal: (context: Context) => Uint8Array

  export const blake2sHex: (data: Data, key?: Key, outlen?: number) => string

  export const blake2sInit: (outlen?: number, key?: Key) => Context

  export const blake2sUpdate: (context: Context, data: Data) => void
}

declare module 'curl-generator';
