import { sizes } from "@montage/ui/src/config";
import fluidify from "./of/fluidify";

export const setHeight = val =>
  fluidify([`height`], sizes[val][0], sizes[val][1]);
export const setWidth = val =>
  fluidify([`width`], sizes[val][0], sizes[val][1]);
export const setSize = val =>
  fluidify([`width`, `height`], sizes[val][0], sizes[val][1]);
