import { useContext } from 'react';
import { PanierContext } from '../context/PanierContext';

export function usePanier() {
    const context = useContext(PanierContext);
    if (!context) throw new Error(
        'usePanier doit être utilisé dans PanierProvider'
    );
    return context;
}