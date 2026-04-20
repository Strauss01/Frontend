export const useAdminStats = () => {
  return { data: null, isLoading: false };
};

export const useAdminUsers = () => {
  return { data: [], isLoading: false };
};

export const useAdminTenants = () => {
  return { data: [], isLoading: false };
};

export const useUpdateUserRole = () => {
  return { mutate: () => {}, isLoading: false };
};

export const useDeleteUser = () => {
  return { mutate: () => {}, isLoading: false };
};
