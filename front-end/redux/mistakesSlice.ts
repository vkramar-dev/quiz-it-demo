import { MistakeDto } from "@/biz/dto/MistakeDto";
import { MistakesRequestDto } from "@/biz/dto/MistakesRequestDto";
import Http from "@/biz/Http";
import { mapMistakes } from "@/biz/mappers/mistakesMapper";
import { Mistake } from "@/biz/models/Mistake";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface MistakesState {
  mistakes: Mistake[];
  topicId: number;
  isByPercentage: boolean;
  isLoading: boolean;
}

const initialState: MistakesState = {
  mistakes: [],
  topicId: 0,
  isByPercentage: false,
  isLoading: false,
};

export const loadMistakes = createAsyncThunk<MistakeDto[], MistakesRequestDto>(
  "MistakesState/loadMistakes",
  async (data) => Http.Statistics.mistakes(data)
);

export const mistakesSlice = createSlice({
  name: "MistakesState",
  initialState,
  reducers: {
    setTopicId: (state, action) => {
      state.topicId = action.payload;
    },
    setIsByPercentage: (state, action) => {
      state.isByPercentage = action.payload;
    },
    resetFilters: (state) => {
      state.topicId = 0;
      state.isByPercentage = false;
    },
  },
  extraReducers: (builder) => {
    // mistakes
    builder.addCase(loadMistakes.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loadMistakes.fulfilled, (state, action) => {
      state.mistakes = mapMistakes(action.payload);
      state.isLoading = false;
    });
    builder.addCase(loadMistakes.rejected, (state, action) => {
      state.isLoading = false;
      console.log("loadMistakes.rejected", action.error);
    });
  },
});

export const { setTopicId, setIsByPercentage, resetFilters } = mistakesSlice.actions;
