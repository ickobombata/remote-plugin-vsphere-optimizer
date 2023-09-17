import { HTMLAttributeTuple } from '@cds/core/internal';
export declare function getProgressCircleRadius(lineThickness: number, viewboxDimension?: number): number;
export declare function getAriaLabelFromTemplate(currentValue: number, loadingi18n: string, forceToValue?: number): string;
export declare function getDefaultAriaLabel(currentValue: number | undefined | null, loadingi18n: string, loopingMsg: string): string;
export declare function getAriaLabelOrDefault(existingAriaLabel: string, currentValue: number, loadingi18n: string, loopingMsg: string, previousValue?: number): string;
export declare function getProgressCircleAriaAttributes(currentValue: number | undefined | null, ariaLabel: string): HTMLAttributeTuple[];
