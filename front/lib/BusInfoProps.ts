export interface BusInfoProp {
  number: [string, string]; // [bus number, color]
  destination: string;
  ETA: string;
  containerClassName?: string;
  badgeClassName?: string;
  showBadge?: boolean;
  showETA?: boolean;
}
