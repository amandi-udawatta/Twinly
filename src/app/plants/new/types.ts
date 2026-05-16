/**
 * Plant registration form state (client-safe).
 */

export interface SavePlantState {
  error: string | null;
  plantId: string | null;
}

export const savePlantInitialState: SavePlantState = {
  error: null,
  plantId: null,
};
