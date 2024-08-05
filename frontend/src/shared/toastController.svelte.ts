export type Toast = {
  message: string;
  duration?: number;
  type?: 'success' | 'error' | 'info'
}

export const toastList: Toast[] = $state([]);

export function showToast({ message, duration = 3000, type = 'error' }: Toast) {
  toastList.push({ message, duration, type });

  setTimeout(() => {
    toastList.unshift()
  }, duration)
}