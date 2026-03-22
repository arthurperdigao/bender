/**
 * src/lib/stores/useAdventureStore.ts
 *
 * Store Zustand para gerenciar o estado da "Jornada do Destino".
 */
import { create } from 'zustand';

interface AdventureState {
    currentSceneId: string;
    points: {
        water: number;
        earth: number;
        fire: number;
        air: number;
    };
    history: string[]; // Para permitir voltar se necessário no futuro
}

interface AdventureActions {
    setScene: (sceneId: string) => void;
    addPoints: (points: Partial<AdventureState['points']>) => void;
    resetAdventure: () => void;
}

const initialState: AdventureState = {
    currentSceneId: 'start',
    points: {
        water: 0,
        earth: 0,
        fire: 0,
        air: 0,
    },
    history: [],
};

export const useAdventureStore = create<AdventureState & AdventureActions>((set) => ({
    ...initialState,

    setScene: (sceneId) => {
        set((state) => ({
            currentSceneId: sceneId,
            history: [...state.history, state.currentSceneId],
        }));
    },

    addPoints: (newPoints) => {
        set((state) => ({
            points: {
                water: state.points.water + (newPoints.water || 0),
                earth: state.points.earth + (newPoints.earth || 0),
                fire: state.points.fire + (newPoints.fire || 0),
                air: state.points.air + (newPoints.air || 0),
            },
        }));
    },

    resetAdventure: () => {
        set(initialState);
    },
}));
