import { KeyCode } from "common/define-type";
import { useEffect } from "react";
import { fromEvent } from "rxjs";

const keyCodeNoModifiers: KeyCode[] = [
    KeyCode.F1,
];

const keyCodeWithCtrlKey: KeyCode[] = [
    KeyCode.equals,
    KeyCode.add,
    KeyCode.p,
    KeyCode.P,
    KeyCode.f,
    KeyCode.F,
    KeyCode.s, // lock save of browser
    KeyCode.S,
    KeyCode.g,
    KeyCode.G,
    KeyCode.subtract,
    KeyCode.minus,
];

function prevent(event: React.MouseEvent | React.KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
}

function preventKeybroadEvent(event: React.KeyboardEvent) {
    const inKeyCodeWithCtrlKey = keyCodeWithCtrlKey.includes(event.key as KeyCode);
    const withModifiers = event.ctrlKey && inKeyCodeWithCtrlKey;
    const noModifiers = keyCodeNoModifiers.includes(event.key as KeyCode);
    if (withModifiers || noModifiers) {
        prevent(event);
    }
}

export function usePreventEvent(): void {
    // const mouseEvent = fromEvent<React.MouseEvent>(document, 'contextmenu');
    const keybroadEvent = fromEvent<React.KeyboardEvent>(document, 'keydown');

    // useEffect(() => {
    //     const subMouseEvent = mouseEvent.subscribe(e => {
    //         prevent(e)
    //     });

    //     return () => {
    //         subMouseEvent && subMouseEvent.unsubscribe();
    //     }
    // }, [mouseEvent]);

    useEffect(() => {
        const subKeybroadEvent = keybroadEvent.subscribe(e => {
            preventKeybroadEvent(e)
        });

        return () => {
            subKeybroadEvent && subKeybroadEvent.unsubscribe();
        }
    }, [keybroadEvent]);

    useEffect(() => {
        const option = {passive: false};
        function preventMouseWheelDefault(event: WheelEvent) {
            if (event.ctrlKey) {
                event.preventDefault();
            }
        }
        window.addEventListener('wheel', preventMouseWheelDefault, option);

        return () => {
            window.removeEventListener('wheel', preventMouseWheelDefault);
        }
    }, [])
}