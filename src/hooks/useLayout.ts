import { create } from "zustand";

interface Ilayout {
  isLoading: boolean;
  isSuccess: boolean;
  isErr: boolean;
  message?: string;
}

const layoutStore = create<Ilayout>(() => ({
  isLoading: false,
  isSuccess: false,
  isErr: false,
  message: undefined,
}));

export const useLayout = () => {
  const isLoading = layoutStore((e) => e.isLoading);
  const isSuccess = layoutStore((e) => e.isSuccess);
  const isErr = layoutStore((e) => e.isErr);
  const isMessage = layoutStore((e) => e.message);

  const setIsSuccess = (isSuccess: boolean, message?: string) => {
    layoutStore.setState({ isSuccess, message });
  };

  const setIsErr = (isErr: boolean, message?: string) => {
    layoutStore.setState({ isErr, message });
  };

  const setIsLoading = (isLoading: boolean, message?: string) => {
    layoutStore.setState({ isLoading, message });
  };

  return {
    isLoading,
    isSuccess,
    isErr,
    isMessage,
    setIsLoading,
    setIsSuccess,
    setIsErr,
  };
};
