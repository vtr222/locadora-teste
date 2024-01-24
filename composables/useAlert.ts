import { ref, type Ref } from "vue";

interface AlertState {
  message: string;
  type: "success" | "error" | "info";
  isVisible: boolean;
}

const alertState: Ref<AlertState> = ref({
  message: "",
  type: "info",
  isVisible: false,
});

export function useAlertMessage() {
  const showMessage = (
    msg: string,
    type: "success" | "error" | "info" = "info",
    duration: number = 3000
  ) => {
    alertState.value = { message: msg, type, isVisible: true };
    setTimeout(() => {
      alertState.value.isVisible = false;
    }, duration);
  };

  return { alertState, showMessage };
}
