export const SOLID_SERVER: string =
  (import.meta as any).env?.VITE_SOLID_SERVER ?? 'http://localhost:3000';

/** When true, skip the server call and return hard-coded mock results */
export const MOCK_MODE: boolean =
  ((import.meta as any).env?.VITE_DTOU_MOCK ?? 'true') === 'true';
