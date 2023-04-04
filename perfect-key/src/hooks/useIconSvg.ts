import HttpClient from "api/http-client";
import GLobalPkm from "common/global";
import { useEffect, useState } from "react";
import { Subscription } from "rxjs/internal/Subscription";
import { take } from "rxjs/operators";


export function useIconSvg(nameSvg: string): string {
    const [svgIcon, setSvgIcon] = useState('');
    useEffect(() => {
        const svg = GLobalPkm.mapSvg.get(nameSvg);
        let sub: Subscription;
        if (svg) {
            setSvgIcon(svg);
        } else {
            sub = HttpClient.get(
                `${process.env.PUBLIC_URL}/assets/icons/${nameSvg}.svg`,
                {responseType: "text"}
            ).pipe(take(1)).subscribe((res) => {
                if (res) {
                    const result = res as string;
                    setSvgIcon(result);
                    GLobalPkm.mapSvg.set(nameSvg, result);
                }
            });
        }
        return () => {
            sub && sub.unsubscribe();
        };
    }, [nameSvg])
    return svgIcon;
}