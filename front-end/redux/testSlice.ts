import { AnswerRequestDto } from "@/biz/dto/AnswerRequestDto";
import { AnswerResponseDto } from "@/biz/dto/AnswerResponseDto";
import { TestDto } from "@/biz/dto/TestDto";
import { TestResultDto } from "@/biz/dto/TestResultDto";
import { Helper } from "@/biz/Helper";
import Http from "@/biz/Http";
import { mapCurrentTest } from "@/biz/mappers/currentTestMapper";
import { mapTestResult } from "@/biz/mappers/testResultMapper";
import { CurrentTest } from "@/biz/models/CurrentTest";
import { TestResult } from "@/biz/models/TestResult";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface TestState {
  test: CurrentTest | null;
  result: TestResult | null;
}

const initialState: TestState = {
  test: null,
  result: null,
};

export const current = createAsyncThunk<TestDto>("test/current", async (_, thunkAPI) => {
  const token = localStorage.getItem(Helper.UserKey);
  if (!token) {
    return thunkAPI.rejectWithValue({ error: "Unauthorized" });
  }

  try {
    return await Http.Test.current();
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.status });
  }
});

export const createTest = createAsyncThunk<TestDto, string, { rejectValue: any }>(
  "test/createTest",
  async (topicName, thunkAPI) => {
    try {
      return await Http.Test.create(topicName);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const cancelTest = createAsyncThunk<void, number, { rejectValue: any }>(
  "test/cancelTest",
  async (testId, thunkAPI) => {
    try {
      await Http.Test.cancel(testId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.status });
    }
  }
);

export const answer = createAsyncThunk<AnswerResponseDto, AnswerRequestDto>(
  "test/answer",
  async (param, thunkAPI) => {
    try {
      return await Http.Test.answer(param);
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.status });
    }
  }
);

export const complete = createAsyncThunk<TestResultDto, number>(
  "test/complete",
  async (param, thunkAPI) => {
    try {
      return await Http.Test.complete(param);
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.status });
    }
  }
);

export const testSlice = createSlice({
  name: "test",
  initialState,
  reducers: {
    setTestData: (
      state,
      action: PayloadAction<{ test: CurrentTest | null; result: TestResult | null }>
    ) => {
      state.test = action.payload.test;
      state.result = action.payload.result;
    },
    decrementTime: (state) => {
      if (state.test) {
        const secondsLeft = state.test.secondsLeft;
        if (secondsLeft > 0) {
          state.test.secondsLeft = secondsLeft - 1;
        }
      }
    },
  },
  extraReducers: (builder) => {
    // current:
    builder.addCase(current.fulfilled, (state, action) => {
      if (action.payload) {
        state.test = mapCurrentTest(action.payload);
      }
      state.result = null;
    });
    builder.addCase(current.rejected, (_, action) => {
      console.log("current.rejected", action.payload);
    });

    // createTest:
    builder.addCase(createTest.fulfilled, (state, action) => {
      state.test = mapCurrentTest(action.payload);
      state.result = null;
    });
    builder.addCase(createTest.rejected, (_, action) => {
      console.log("createTest.rejected", action.payload);
    });

    // cancelTest:
    builder.addCase(cancelTest.fulfilled, (state) => {
      state.test = null;
      state.result = null;
    });
    builder.addCase(cancelTest.rejected, (_, action) => {
      console.log("cancelTest.rejected", action.payload);
    });

    // answer:
    builder.addCase(answer.fulfilled, (state, action) => {
      let ap = action.payload;

      if (ap.nextQuestion && state.test) {
        state.test.questionText = ap.nextQuestion.text;
        state.test.questionAnswer1 = ap.nextQuestion.answer1;
        state.test.questionAnswer2 = ap.nextQuestion.answer2;
        state.test.questionAnswer3 = ap.nextQuestion.answer3;
        state.test.questionAnswer4 = ap.nextQuestion.answer4;
        state.test.questionId = ap.nextQuestion.questionId;
        state.test.testQuestionId = ap.nextQuestion.testQuestionId;
        state.test.number = ap.nextQuestion.number;
        state.test.secondsLeft = ap.nextQuestion.secondsLeft;

        state.result = null;
      } else if (ap.testResult) {
        state.result = mapTestResult(ap.testResult);
        state.test = null;
      } else {
        console.log("answer.fulfilled: unexpected payload", ap);
      }
    });
    builder.addCase(answer.rejected, (_, action) => {
      console.log("answer.rejected", action.payload);
    });

    // complete:
    builder.addCase(complete.fulfilled, (state, action) => {
      state.test = null;
      state.result = mapTestResult(action.payload);
    });
    builder.addCase(complete.rejected, (_, action) => {
      console.log("complete.rejected", action.payload);
    });
  },
});

export const { setTestData, decrementTime } = testSlice.actions;
