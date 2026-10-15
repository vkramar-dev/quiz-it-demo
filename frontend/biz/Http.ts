import { store } from "@/redux/store";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import { AnswerRequestDto } from "./dto/AnswerRequestDto";
import { MistakesRequestDto } from "./dto/MistakesRequestDto";
import { StatisticsRequestDto } from "./dto/StatisticsRequestDto";
import { TestDto } from "./dto/TestDto";
import { AnswerResponseDto } from "./dto/AnswerResponseDto";
import { TestResultDto } from "./dto/TestResultDto";
import { AppStateDto } from "./dto/AppStateDto";
import { UserDto } from "./dto/UserDto";
import { MistakeDto } from "./dto/MistakeDto";
import { ProfileDto } from "./dto/profile/ProfileDto";
import { StatisticsPageDto } from "./dto/StatisticsPageDto";

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "https://localhost:7072/api/",
  withCredentials: false,
  timeout: 60000,
});

const responseBody = <T>(response: AxiosResponse<T>): T => response.data;

api.interceptors.request.use((config) => {
  const token = store.getState().appState.user?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (!error.response) {
      console.log("Network/API error:", error.message);
      return Promise.reject({
        status: 0,
        message: "Network error or server is unavailable.",
      });
    }

    const { status, data } = error.response;
    console.log("response error:", status, data);
    return Promise.reject(data);
  }
);

const requests = {
  get: <T>(url: string, params?: object, signal?: AbortSignal) =>
    api.get<T>(url, { params, signal }).then(responseBody),

  post: <T>(url: string, body?: object, signal?: AbortSignal) =>
    api.post<T>(url, body ?? {}, { signal }).then(responseBody),

  put: <T>(url: string, body?: object, signal?: AbortSignal) =>
    api.put<T>(url, body ?? {}, { signal }).then(responseBody),

  delete: <T>(url: string, signal?: AbortSignal) =>
    api.delete<T>(url, { signal }).then(responseBody),
};

const App = {
  initState: () => requests.get<AppStateDto>("app/init-state"),
  login: (values: object) => requests.post<UserDto>("app/login", values),
  register: (values: object) => requests.post<UserDto>("app/register", values),
  currentUser: () => requests.get("app/currentUser"),
};

const Test = {
  current: () => requests.get<TestDto>("tests/current"),

  create: (topicName: string) => requests.post<TestDto>("tests/create", { topicName }),

  cancel: (testId: number) => requests.post<void>("tests/cancel", { testId }),

  answer: (requestModel: AnswerRequestDto) =>
    requests.post<AnswerResponseDto>("tests/answer", requestModel),

  complete: (testId: number) =>
    requests.post<TestResultDto>("tests/complete", { testId }),
};

const Statistics = {
  page: (requestModel: StatisticsRequestDto, signal?: AbortSignal) =>
    requests.get<StatisticsPageDto>("statistics/page", requestModel, signal),

  profile: () => requests.get<ProfileDto>("statistics/profile"),

  hide: () => requests.put<ProfileDto>("statistics/hide"),

  mistakes: (requestModel: MistakesRequestDto, signal?: AbortSignal) =>
    requests.get<MistakeDto[]>("statistics/mistakes", requestModel, signal),
};

const Http = {
  App,
  Test,
  Statistics,
};

export default Http;
