import * as React from "react";
import * as ReactDOM from "react-dom";
import { ApplicationReact, initializeReactContext } from "./react";

(<any>window).foundryLibReact = {
  React,
  ReactDOM,
  ReactFoundry: { ApplicationReact },
};

Hooks.once("init", () => {
  initializeReactContext();
});
