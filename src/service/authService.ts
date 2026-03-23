import useFetch from "./useFetch";

export const useAuthService = () => {
  const { GET } = useFetch();

  const getMe = async (): Promise<CurrentUser | undefined> => {
    return await GET<CurrentUser>("/api/Login/me");
  };

  return { getMe };
};

export interface CurrentUser {
  idUser: number;
  role: string;
}
