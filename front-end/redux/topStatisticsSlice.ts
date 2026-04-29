import { StatisticsPageDto } from "@/biz/dto/StatisticsPageDto";
import Http from "@/biz/Http";
import { Row } from "@/biz/models/Row";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TopStatisticsState {
  rows: Row[];
  pageSize: number;
  pageNumber: number;
  scoreThreshold: number;
  topicId: number;
  totalCount: number;
}

const initialState: TopStatisticsState = {
  rows: [],
  pageSize: 10,
  pageNumber: 1,
  scoreThreshold: 0,
  topicId: 0,
  totalCount: 0,
};

export const getPage = createAsyncThunk<StatisticsPageDto>(
  "stat/getPage",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as { statState: TopStatisticsState };

    return Http.Statistics.page({
      pageNumber: state.statState.pageNumber - 1,
      pageSize: state.statState.pageSize,
      scoreThreshold: state.statState.scoreThreshold,
      topicId: state.statState.topicId,
    });
  }
);

export const topStatisticsSlice = createSlice({
  name: "statState",
  initialState,
  reducers: {
    setTopic: (state, action: PayloadAction<number>) => {
      state.topicId = action.payload;
      state.pageNumber = 1;
    },
    setScore: (state, action: PayloadAction<number>) => {
      state.scoreThreshold = action.payload;
      state.pageNumber = 1;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.pageNumber = 1;
    },
    setPageNumber: (state, action: PayloadAction<number>) => {
      state.pageNumber = action.payload;
    },
    resetFilters: (state) => {
      state.topicId = 0;
      state.scoreThreshold = 0;
      state.pageNumber = 1;
    },
  },
  extraReducers: (builder) => {
    // getPage
    builder.addCase(getPage.fulfilled, (state, action) => {
      state.totalCount = action.payload.totalCount;
      state.rows = action.payload.rows;
    });
    builder.addCase(getPage.rejected, (_, action) => {
      console.log("getPage.rejected", action.error);
    });
  },
});

export const { setTopic, setScore, setPageSize, setPageNumber, resetFilters } =
  topStatisticsSlice.actions;
