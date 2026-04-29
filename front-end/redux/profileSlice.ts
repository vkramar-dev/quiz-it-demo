import { ProfileDto } from "@/biz/dto/profile/ProfileDto";
import Http from "@/biz/Http";
import { Profile } from "@/biz/models/profile/Profile";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface ProfileState {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  profile: null,
  isLoading: false,
  error: null,
};

export const getProfile = createAsyncThunk<ProfileDto>("profile/getProfile", async () =>
  Http.Statistics.profile()
);

export const hide = createAsyncThunk<ProfileDto>("profile/hide", async () =>
  Http.Statistics.hide()
);

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // getProfile
    builder.addCase(getProfile.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getProfile.fulfilled, (state, action) => {
      state.profile = action.payload;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(getProfile.rejected, (state, action) => {
      state.isLoading = false;
      state.profile = null;
      state.error = action.error.message ?? "Failed to load profile.";
      console.log("getProfile.rejected", action.error);
    });

    // hide
    builder.addCase(hide.fulfilled, (state, action) => {
      state.profile = { ...action.payload };
    });
    builder.addCase(hide.rejected, (_, action) => {
      console.log("hide.rejected", action.error);
    });
  },
});
