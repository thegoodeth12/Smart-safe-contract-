import { useEffect, useState } from "react";

export interface SavedContract {
  name: string;
  address: string;
  network: string;
}

const STORAGE_KEY = "saved_contracts";

export function useSavedContracts() {
  const [contracts, setContracts] = useState<SavedContract[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setContracts(JSON.parse(stored));
    }
  }, []);

  function saveContracts(newContracts: SavedContract[]) {
    setContracts(newContracts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newContracts));
  }

  function addContract(contract: SavedContract) {
    saveContracts([...contracts, contract]);
  }

  function removeContract(address: string) {
    saveContracts(contracts.filter(c => c.address !== address));
  }

  return { contracts, addContract, removeContract };
}
