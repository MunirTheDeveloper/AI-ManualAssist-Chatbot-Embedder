import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class responsiveIframePCFControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    // Reference to IFrame HTMLElement
    private _iframe: HTMLIFrameElement;

    // Properties for iframe attributes
    private _Source: string;
    private _iframeWidth: string;
    private _iframeHeight: string;

    // Reference to the control container HTMLDivElement
    private _container: HTMLDivElement;

    // Flag if control view has been rendered
    private _controlViewRendered: boolean;

    /**
     * Empty constructor.
     */
    constructor() {
    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this._container = container;
        this._controlViewRendered = false;

        this._container.style.width = "100%";
        this._container.style.height = "100%";
        this._container.style.display = "flex";
        this._container.style.justifyContent = "center";
        this._container.style.alignItems = "center";
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        const newSource = context.parameters.source.raw;
        const newWidth = context.parameters.iframeWidth ? context.parameters.iframeWidth.raw : "100%";
        const newHeight = context.parameters.iframeHeight ? context.parameters.iframeHeight.raw : "600px";

        if (!this._controlViewRendered) {
            this.renderIFrame(newSource, newWidth, newHeight);
            this._controlViewRendered = true;
        }

        if (this._Source !== newSource) {
            this._Source = newSource ? newSource : "";
            if (this._iframe) {
                this._iframe.setAttribute("src", this._Source);
            }
        }
        if (this._iframeWidth !== newWidth) {
            this._iframeWidth = newWidth ? newWidth : "100%";
            if (this._iframe) {
                this._iframe.style.width = this._iframeWidth;
            }
        }
        if (this._iframeHeight !== newHeight) {
            this._iframeHeight = newHeight ? newHeight : "600px";
            if (this._iframe) {
                this._iframe.style.height = this._iframeHeight;
            }
        }
    }

    /**
     * Render iframe HTML Element and appends it to the control container
     */
    private renderIFrame(initialSrc: string, initialWidth: string, initialHeight: string): void {
        const iFrameElement: HTMLIFrameElement = document.createElement("iframe");
        iFrameElement.setAttribute("class", "iFrameControl");
        iFrameElement.setAttribute("frameborder", "0");

        iFrameElement.style.border = "none";
        iFrameElement.style.borderRadius = "8px";
        iFrameElement.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.15)";
        iFrameElement.style.flexGrow = "1";
        iFrameElement.style.minWidth = "280px";
        iFrameElement.style.minHeight = "400px";

        iFrameElement.setAttribute("allow", "camera; microphone; display-capture; geolocation;"); 
        iFrameElement.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-presentation allow-pointer-lock allow-downloads"); 

        iFrameElement.setAttribute("src", initialSrc || "");
        iFrameElement.style.width = initialWidth || "100%";
        iFrameElement.style.height = initialHeight || "600px";

        this._iframe = iFrameElement;
        this._container.appendChild(this._iframe);
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
