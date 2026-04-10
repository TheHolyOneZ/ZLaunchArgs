import { useCallback } from "react";
import { useUiStore } from "../stores/uiStore";
export function useNotifications() {
  const showToast = useUiStore((s) => s.showToast);
  const notifySuccess = useCallback(
    (msg: string) => showToast(msg, "success"),
    [showToast]
  );
  const notifyError = useCallback(
    (msg: string) => showToast(msg, "error"),
    [showToast]
  );
  const notifyInfo = useCallback(
    (msg: string) => showToast(msg, "info"),
    [showToast]
  );
  return { notifySuccess, notifyError, notifyInfo };
}
