'use client';

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { toggleCarStatus } from './actions';

export function CarStatusToggle({ carId, initialStatus }: { carId: string; initialStatus: boolean }) {
  const [isAvailable, setIsAvailable] = useState(initialStatus);
  const [isPending, setIsPending] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setIsAvailable(checked);
    setIsPending(true);
    try {
      await toggleCarStatus(carId, checked);
    } catch (error) {
      console.error(error);
      setIsAvailable(!checked); // revert on error
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch 
        checked={isAvailable} 
        onCheckedChange={handleToggle} 
        disabled={isPending}
        className={isAvailable ? "!bg-green-500" : ""}
      />
      <span className="text-sm font-medium w-20">
        {isAvailable ? 'Available' : 'Unavailable'}
      </span>
    </div>
  );
}
