export interface IGraphSettings {
  id: string;
  color: string;
  // minimum visible value range, grows with the data
  dims: [min: number, max: number];
}

export interface IGraphConfig extends IGraphSettings {
  system_name: string;
}
