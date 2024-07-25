import { existsSync } from 'fs';
import { mkdir, readFile } from "fs/promises";
import { writeJSON } from "./general.utils.js";
import { join } from 'path';

export async function getFontJSON(fontDir: string, getLocal: bol): Promise<Font[] | string> {
    const jsonPath = join(fontDir, 'fonts.json');
    await mkdir(fontDir, { recursive: true }); // ensure the 'temp' dir is there

    if (getLocal && existsSync(jsonPath)) {
        return JSON.parse(await readFile(jsonPath, { encoding: 'utf-8' }));
    } else if (getLocal) {
        return "No offline data available. (Connect to a network first)"
    }

    const nerdFontListJSON_url = "https://raw.githubusercontent.com/ryanoasis/nerd-fonts/master/bin/scripts/lib/fonts.json";
    const res = await fetch(nerdFontListJSON_url);

    const json = await res.json() as NerdFonts;
    if (!json?.fonts?.length) return "[ERROR]: Couldn't load font data JSON";

    const didWrite = await writeJSON(jsonPath, json.fonts);
    if (!didWrite) throw "[ERROR (Fatal)]: Couldn't write to JSON"

    return json.fonts;
}
