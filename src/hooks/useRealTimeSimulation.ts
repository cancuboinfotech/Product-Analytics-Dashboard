import { useEffect } from 'react';
import { Product } from '../types/product';

export const useRealTimeSimulation = (
  onUpdate: (updatedProducts: Product[]) => void,
  enabled: boolean = true
) => {
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      // For the simulation, we just trigger a manual update with some random changes
      // In a real app, this would be a WebSocket listener
      const productsToUpdate: Product[] = [];
      
      // Simulate 3 products updating
      for (let i = 0; i < 3; i++) {
        const randomPrice = Math.floor(Math.random() * 950) + 50;
        const randomStock = Math.floor(Math.random() * 200);
        const randomId = `prod-${Math.floor(Math.random() * 1000)}`;
        
        productsToUpdate.push({
          id: randomId,
          price: randomPrice,
          stock: randomStock,
        } as Product);
      }

      onUpdate(productsToUpdate);
    }, 3000);

    return () => clearInterval(interval);
  }, [onUpdate, enabled]);
};
