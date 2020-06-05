interface WatchItem {
    element: HTMLDivElement,
    callback: (state: boolean) => void,
    value: boolean
}

export class DomWatch {
    private static visibleItems: WatchItem[] = [];
    static visibleChange(element: HTMLDivElement, callback: (state: boolean) => void) {
        this.visibleItems.push({
            element: element, 
            callback: callback,
            value: false
        });
    }

    static visibleChanged() {
        setTimeout(() => {
            this.visibleItems.forEach((item: WatchItem) => {
                if (item.value != Boolean(item.element.offsetParent)) {
                    item.value = Boolean(item.element.offsetParent);
                    item.callback(item.value);
                }
            });
        })
    }
}