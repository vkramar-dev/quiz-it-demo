import { ApiErrorPayload } from "@/biz/dto/ApiErrorPayload";
import { AppStateDto } from "@/biz/dto/AppStateDto";
import { UserDto } from "@/biz/dto/UserDto";
import { Helper } from "@/biz/Helper";
import Http from "@/biz/Http";
import { mapTopic } from "@/biz/mappers/topicMapper";
import { LoginFields } from "@/biz/models/LoginFields";
import { NavItem } from "@/biz/models/NavItems";
import { RegisterFields } from "@/biz/models/RegisterFields";
import { Topic } from "@/biz/models/Topic";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AppState {
  topics: Topic[];
  user: UserDto | null;
  forbiddenPages: NavItem[];
  isLoginDialogOpen: boolean;
  isRegisterDialogOpen: boolean;
}

const initialState: AppState = {
  topics: [],
  user: null,
  forbiddenPages: [NavItem.Profile],
  isLoginDialogOpen: false,
  isRegisterDialogOpen: false,
};

function applyUserState(state: AppState, user: UserDto | null) {
  state.user = user;

  if (user) {
    localStorage.setItem(Helper.UserKey, JSON.stringify(user));
    state.forbiddenPages = [];
  } else {
    localStorage.removeItem(Helper.UserKey);
    state.forbiddenPages = [NavItem.Profile];
  }
}

export const initState = createAsyncThunk<AppStateDto>(
  "appState/initState",
  async (_, thunkAPI) => {
    let token = localStorage.getItem(Helper.UserKey);
    if (token) {
      try {
        let json = JSON.parse(token);
        thunkAPI.dispatch(setUser({ user: json })); // Set user from localStorage before API call
      } catch {
        localStorage.removeItem(Helper.UserKey);
      }
    }

    return await Http.App.initState();
  }
);

export const registerInUser = createAsyncThunk<
  UserDto,
  RegisterFields,
  { rejectValue: ApiErrorPayload }
>("appState/registerInUser", async (data, thunkAPI) => {
  try {
    return await Http.App.register(data);
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.errors });
  }
});

export const signInUser = createAsyncThunk<
  UserDto,
  LoginFields,
  { rejectValue: ApiErrorPayload }
>("appState/signInUser", async (data, thunkAPI) => {
  try {
    return await Http.App.login(data);
  } catch (error: any) {
    return thunkAPI.rejectWithValue({ error: error.errors });
  }
});

export const appSlice = createSlice({
  name: "appState",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<{ user: UserDto | null }>) => {
      applyUserState(state, action.payload.user);
    },
    logOut: (state) => {
      applyUserState(state, null);
    },
    setForbiddenPages: (state, action: PayloadAction<NavItem[]>) => {
      state.forbiddenPages = action.payload;
    },

    // Login form reducers
    openLoginForm: (state) => {
      state.isLoginDialogOpen = true;
      state.isRegisterDialogOpen = false;
    },
    closeLoginForm: (state) => {
      state.isLoginDialogOpen = false;
    },

    // Register form reducers
    openRegisterForm: (state) => {
      state.isRegisterDialogOpen = true;
      state.isLoginDialogOpen = false;
    },
    closeRegisterForm: (state) => {
      state.isRegisterDialogOpen = false;
    },
  },
  extraReducers: (builder) => {
    // initState
    builder.addCase(initState.fulfilled, (state, action) => {
      state.topics = action.payload.topics.map(mapTopic);
      applyUserState(state, action.payload.user);
    });
    builder.addCase(initState.rejected, (_, action) => {
      console.log("initState.rejected", action.payload);
    });

    // registerInUser
    builder.addCase(registerInUser.fulfilled, (state, action) => {
      applyUserState(state, action.payload);
      state.isRegisterDialogOpen = false;
    });
    builder.addCase(registerInUser.rejected, (_, action) => {
      console.log("registerInUser.rejected", action.payload);
    });

    // signInUser
    builder.addCase(signInUser.fulfilled, (state, action) => {
      applyUserState(state, action.payload);
      state.isLoginDialogOpen = false;
    });
    builder.addCase(signInUser.rejected, (_, action) => {
      console.log("signInUser.rejected", action.payload);
    });
  },
});

export const {
  setUser,
  logOut,
  setForbiddenPages,
  openLoginForm,
  closeLoginForm,
  openRegisterForm,
  closeRegisterForm,
} = appSlice.actions;
