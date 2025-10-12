import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";


export const fetchUserOrgs = createAsyncThunk("orgs/fetchUserOrgs", async () => {
  const { data } = await api.get("/organization");
  return data;
});


export const createOrg = createAsyncThunk("orgs/createOrg", async (name) => {
  const { data } = await api.post("/organization/create", { name });
  return data;
});


export const inviteToOrg = createAsyncThunk("orgs/inviteToOrg", async ({ orgId, email }) => {
  const { data } = await api.post(`/organization/${orgId}/invite`, { email });
  return data;
});


export const switchOrganization = createAsyncThunk("orgs/switchOrganization", async (orgId) => {
  const { data } = await api.post(`/organization/${orgId}/switch`);
  return data;
});


export const renameOrg = createAsyncThunk("orgs/renameOrg", async ({ orgId, newName }) => {
  const { data } = await api.patch(`/organization/${orgId}/rename`, { newName });
  return data;
});

const orgSlice = createSlice({
  name: "orgs",
  initialState: {
    list: [],
    activeOrg: null,
    status: "idle",
    error: null,
  },
  reducers: {
    setActiveOrg: (state, action) => {
      state.activeOrg = action.payload;
    },
  },
  extraReducers: (b) => {
    b.addCase(fetchUserOrgs.pending, (s) => {
      s.status = "loading";
    })
      .addCase(fetchUserOrgs.fulfilled, (s, a) => {
        s.list = a.payload;
        s.status = "succeeded";
      })
      .addCase(fetchUserOrgs.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.error.message;
      })
      .addCase(createOrg.fulfilled, (s, a) => {
        s.list.push(a.payload);
        s.activeOrg = a.payload;
      })
      .addCase(switchOrganization.fulfilled, (s, a) => {
        s.activeOrg = a.payload.activeOrganization;
      })
      .addCase(renameOrg.fulfilled, (s, a) => {
        const updatedOrg = a.payload.org;
        const index = s.list.findIndex(org => org._id === updatedOrg._id);
        if (index !== -1) {
          s.list[index] = updatedOrg;
        }
      });
  },
});

export const { setActiveOrg } = orgSlice.actions;
export default orgSlice.reducer;
