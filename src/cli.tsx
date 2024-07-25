import './init.js';

import React from 'react';
import { render } from 'ink';
import { getFontJSON } from './utils/app.utils.js';
import { isType, wait } from './utils/general.utils.js';
import { Table } from './app.js';


wait(0).then(async () => {
    const isOnline = true;
    const fontDir = joinAppDir(env.isDev ? '../temp' : '~/.termux/fonts');

    const data = await getFontJSON(fontDir, !isOnline);
    if (isType(data, 'string')) return logErr(data);

    const d1 = data.map((x, i) => [i + 1, '⮚', x.unpatchedName, '✓   '])


    // const table = makeTable(['#', '\ueb85', 'Font Name', '\uf409'], d1, 'NerdFonts Selector')
    // log(table)
    render(<Table
        {...{
        data: d1,
        headers: ['#', '\ueb85', 'Font Name', '\uf409'],
        title: 'NerdFonts'
    }}/>)
    // debugger
});

function makeTable(th: str[], data: str[][], title?: str): str {
    const l = '│'
    const _ = '─'
    const nl = '\n'

    function createTitleRow(text: str, tableWidth: num): str {
        const paddedText = ` ${text} `;
        const leftPadding = Math.floor((tableWidth - paddedText.length) / 2);
        const rightPadding = tableWidth - paddedText.length - leftPadding;

        return "├" + _.repeat(leftPadding) + paddedText + _.repeat(rightPadding) + "┤";
    }

    const RES = "\x1b[0m";
    const BG_GRAY = "\x1b[100m";

    // Calculate the length of each col
    const cLen = th.map(s => s.length);
    data.map(arr => arr.map((s, i) => cLen[i] = Math.max(cLen[i] || 0, s.length)))

    const thStrs = th.map((x, i) => ` ${x.padEnd(cLen[i]!)} `);

    const row2 = l + thStrs.join(l) + l;
    const row3 = l + thStrs.map(x => _.repeat(x.length)).join("┼") + l;

    const line = _.repeat(row2.length - 2);

    const top = `┌${line}┐`;
    const bot = `└${line}┘`;

    let str = ''

    if (title)
        str += createTitleRow(title, row2.length - 2);

    str += // ├┤
    nl + top +
    nl + row2 +
    nl + row3 + nl +
    data.map((arr, idx) => {
        const rowContent = arr.map((s, i) => ` ${s.padEnd(cLen[i]!)} `).join(l);
        return l + (idx % 2 ? rowContent : `${BG_GRAY}${rowContent}${RES}`) + l;
    }).join(nl) +
    nl + bot

    return str
}
