declare module "spin-wheel" {
  export interface WheelItem {
    label?: string;
    backgroundColor?: string;
    labelColor?: string;
    image?: string;
    imageRadius?: number;
    imageRotation?: number;
    imageScale?: number;
    weight?: number;
  }

  export interface WheelOptions {
    debug?: boolean;
    items?: WheelItem[];
    borderWidth?: number;
    borderColor?: string;
    overlayImage?: string;
    radius?: number;
    itemLabelRadius?: number;
    itemLabelRadiusMax?: number;
    itemLabelRotation?: number;
    itemLabelAlign?: "left" | "center" | "right";
    itemLabelBaselineOffset?: number;
    itemLabelFont?: string;
    itemLabelFontSizeMax?: number;
    itemBackgroundColors?: string[];
    itemLabelColors?: string[];
    rotationSpeedMax?: number;
    rotationResistance?: number;
    lineWidth?: number;
    lineColor?: string;
    image?: string;
    isInteractive?: boolean;
    pointerAngle?: number;
    rotation?: number;
    onRest?: (event?: unknown) => void;
    onSpin?: (event?: unknown) => void;
  }

  export class Wheel {
    constructor (container: HTMLElement, options?: WheelOptions);

    init (options?: WheelOptions): void;
    spin (rotationSpeed?: number): void;
    spinTo (rotation?: number, duration?: number): void;
    spinToItem (
      itemIndex?: number,
      duration?: number,
      spinToCenter?: boolean,
      numberOfRevolutions?: number,
      direction?: number,
      easingFunction?: (t: number) => number
    ): void;
    stop (): void;
    getCurrentIndex (): number | null;
    remove (): void;

    rotation: number;
    isSpinning: boolean;
    items: WheelItem[];
    pointerAngle: number;
    borderWidth: number;
    borderColor: string;
    radius: number;
    itemLabelRadius: number;
    itemLabelAlign: "left" | "center" | "right";
    itemLabelFont: string;
    itemLabelFontSizeMax: number;
    onRest?: (event?: unknown) => void;
    onCurrentIndexChange?: (event?: unknown) => void;
    onSpin?: (event?: unknown) => void;
  }
}
