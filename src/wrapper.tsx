import {
  ComponentType,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

export interface ComponentWrapperProps {
  Component: ComponentType<any>;
  wrapper: HTMLElement;
}

export interface ComponentWrapperInstance {
  set data(value: any);
  triggerRender(): void;
}

export const ComponentWrapper = forwardRef<
  ComponentWrapperInstance,
  ComponentWrapperProps
>(({ Component, wrapper }, ref) => {
  const [, dispatch] = useState<{}>(Object.create(null));
  const dataRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    set data(value: any) {
      dataRef.current = value;
      dispatch(Object.create(null));
    },
    triggerRender() {
      dispatch(Object.create(null));
    },
  }));

  if (dataRef.current) {
    return createPortal(<Component {...dataRef.current} />, wrapper);
  }
  return null;
});
