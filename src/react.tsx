import { ComponentType, ReactNode, useState } from "react";
import { render } from "react-dom";
import { ComponentWrapper, ComponentWrapperInstance } from "./wrapper";

let globalForceUpdate: (() => void) | null = null;
const globalElement: ReactNode[] = [];

function Manager() {
  const [, update] = useState(0);
  globalForceUpdate = () => update((v) => v + 1);
  return <>{...globalElement}</>;
}

export function initializeReactContext() {
  const wrapper = document.createElement("div");
  const randomId = Math.floor(1000 + Math.random() * 8999);
  wrapper.setAttribute("id", `foundry-vtt-react-lib-${randomId}`);
  document.body.append(wrapper);
  render(<Manager />, wrapper);
}

export type ApplicationReactOptions<P> = {
  component: ComponentType<any>;
} & Application.Options &
  P;

export class ApplicationReact<P> extends Application<
  ApplicationReactOptions<P>
> {
  private _wrapperElement: HTMLElement;
  private _wrapper: ReactNode;
  private _component: ComponentWrapperInstance | null = null;

  static get defaultOptions() {
    return mergeObject<Partial<ApplicationReactOptions<any>>>(
      super.defaultOptions,
      {
        component: null,
      }
    ) as Application.Options;
  }

  constructor(options?: Partial<ApplicationReactOptions<P>>) {
    super(options);

    if (!this.options.component) {
      throw new Error("ApplicationReact created without any component");
    }

    this._wrapperElement = document.createElement("div");
    this._wrapper = (
      <ComponentWrapper
        Component={this.options.component}
        wrapper={this._wrapperElement}
        ref={(ref) => (this._component = ref)}
      />
    );
    globalElement.push(this._wrapper);
    globalForceUpdate?.();
  }

  async _renderInner(
    _data: object,
    _options?: Application.RenderOptions
  ): Promise<JQuery<HTMLElement>> {
    if (this._component) {
      this._component.data = { data: _data, application: this };
    }
    return $(this._wrapperElement);
  }

  async close(_options?: Application.CloseOptions) {
    globalElement.findSplice((x) => x === this._wrapper);
    this._component?.triggerRender();
    super.close();
  }
}
