import type { Route } from "./+types/home";
import React from "react";
import GameGraph from "~/game-graph/game-graph";
import { AudioProvider } from "~/audio-provider/AudioProvider";

export function meta({}: Route.MetaArgs) {
    return [
        { title: "風祭り - Kaze Matsuri" },
        { name: "description", content: "Memorize Kanji with Kaze (風) Matsuri (祭り)" },
    ];
}

export default function Home() {
    const titleStyle = {
        webkitTextStroke: "1px black",
        fontWeight: "bold",
        textShadow: "1px 2px 10px rgba(0, 0, 0, 0.5), 2px 3px 25px rgba(0, 0, 0, 0.4)",
    };
    return (
        <div className="flex items-center flex-col">
            <div className="main-title">
                <h1 style={ titleStyle }>
                    <span style={ { color: "#ff6097" } }>風</span>
                    <span style={ { color: "#58ecb3" } }>祭</span>
                    <span style={ { color: "#ff9a44" } }>り</span>
                </h1>
                <h1 style={ titleStyle }>
                    <span style={ { color: "#ffdd67" } }>Kaze</span>
                    <span style={ { color: "#58ecb3" } }>Matsuri</span>
                </h1>
            </div>
            <div className="main-content">
                <AudioProvider>
                    <GameGraph/>
                </AudioProvider>
            </div>
        </div>
    );
}
