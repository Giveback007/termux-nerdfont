import React, { useEffect, useState } from "react"
import { Table } from "./table.js"
import { download } from "../utils/general.utils.js"
import { join } from "path";

export function App({
    fonts, fontDir
}: {
    fonts: Font_1[];
    fontDir: str;
}) {
    const map = new Map(fonts.map((x, idx) => [x.caskName, { ...x, idx: idx }]));
    const [data, setData] = useState<TableDataItem[]>(
        fonts.map((x, i) => ({ id: x.caskName, row: [i + 1, ' ', x.unpatchedName, '    ']}))
    );

    // useEffect(() => {

    // }, );

    return <Table
        {...{
        title: 'NerdFonts Selector',
        headers: ['#', '\ueb85', 'Font Name', '\uf409'],
        data,
        onSelected: async ({ id }) => {
            const obj = map.get(id);
            const item = data[obj?.idx ?? -1];
            const fileName = obj?.imagePreviewFontSource.split('/').at(-1)
            if (!obj || !item || !fileName) throw new Error('Unhandled');

            item.row[1] = '⮚'
            // const url = `https://github.com/ryanoasis/nerd-fonts/tree/master/patched-fonts/${obj.imagePreviewFontSource}`;
            const url = `https://api.github.com/repos/ryanoasis/nerd-fonts/contents/patched-fonts/${'3270/Regular/'}`//${obj.folderName}`

            const res = await fetch(url);

            const json = await res.json()
            debugger
            // mono & regular
            log(url, json)
            return
            // https://api.github.com/repos/ryanoasis/nerd-fonts/contents/patched-fonts/

            const x = await download(url, join(fontDir, fileName), prc => {
                log(prc)
                item.row[3] = prc
                const newData = [...data]
                newData[obj.idx] = item
                setData(newData)
                // ✓
            })

            log(x)
            debugger
        }
    }}/>
}