import React from "react";

const MyContext = React.createContext(null);
export default MyContext;

export const initialState = {
  name: null,
  ip: null,
  mac: null,
  newdevice: false,
};

export function reducer(state, action) {
  switch (action.type) {
    case "DEVICE_INFO":
      return {
        name: action.name,
        ip: action.ip,
        mac: action.mac,
        newdevice: action.newdevice,
      };
    default:
      return initialState;
  }
}
