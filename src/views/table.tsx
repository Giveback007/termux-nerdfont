import React, { useEffect, useState } from 'react';
import {Text, useInput, useStdout} from 'ink';
import { isType } from '../utils/general.utils.js';

const u = '─';
const l = '│';

export function Table({
	title, headers: _headers, data, onSelected
}: {
	title?: str;
	headers: str[];
	data: TableDataItem[];
	onSelected: (arr: TableDataItem) => any;
}) {
	const [selIdx, setSelIdx] = useState(0);

	useInput((input, key) => {
		if (key.upArrow || input === 'j')
			setSelIdx(Math.max(selIdx - 1, 0))
		if (key.downArrow || input === 'k')
			setSelIdx(Math.min(selIdx + 1, data.length - 1))
		if (key.return || input === ' ')
			onSelected(data[selIdx]!)
	}, { isActive: true });

    const { stdout } = useStdout();
    const [viewportHeight, setViewportHeight] = useState(stdout.rows - 7); // Adjust for header and footer

    useEffect(() => {
        const updateViewportHeight = () => {
            setViewportHeight(stdout.rows - 7);
        };
        stdout.on('resize', updateViewportHeight);
        return () => {
            stdout.off('resize', updateViewportHeight);
        };
    }, [stdout]);

	const strData = data.map(obj => obj.row.map(x => !isType(x, 'string') ? x.toString() : x));
	const cLen = _headers.map(s => s.length);
    strData.map(arr => arr.map((s, i) => cLen[i] = Math.max(cLen[i] || 0, s.length)))
	const tableWidth = cLen.reduce((sum, a) => sum + a + 2, cLen.length + 1) - 2;

	const line = u.repeat(tableWidth);

    const top = title ? <Title {...{title, tableWidth }} /> : <Text>{`┌${line}┐`}</Text>
	const headers = _headers.map((text, i) => [text, cLen[i] || 0] as [str, num])
    const bot = `└${line}┘`;

	const dataSliceIdx = Math.min(selIdx, strData.length - viewportHeight)

	return <>
		{top}
		<TableHeader {...{headers}}/>
		{strData.slice(dataSliceIdx, selIdx + viewportHeight).map((arr, i) => {
			const idx = Number(arr[0]) - 1;
			const rowContent = arr.map((s, i) => ` ${s.padEnd(cLen[i]!)} `).join(l);
			return <Text key={idx}>
				{l}<Text
					backgroundColor={i % 2 ? 'black' : 'gray'}
					inverse={idx === selIdx}
				>{rowContent}</Text>{l}
			</Text>;
    	})}
		{<Text>{dataSliceIdx === strData.length - viewportHeight ? bot : ` ⮟ ... ${strData.length} ⮟`}</Text>}

		<Text>Use j/k or ↑/↓; Press enter/space to select</Text>
	</>
}

export function Title({
	title, tableWidth
}: {
	title: str; tableWidth: num;
}) {

	const paddedText = `┤ ${title} ├`
	const titleText = <Text bold>{paddedText}</Text>;

	const leftPadding = Math.floor((tableWidth - paddedText.length) / 2);
	const rightPadding = tableWidth - paddedText.length - leftPadding;

	return <Text>{"┌" + u.repeat(leftPadding)}{titleText}{u.repeat(rightPadding) + "┐"}</Text>
}

export function TableHeader({
	headers
}: {
	headers: [str, num][];
}) {
	const x = headers.map(([text, len]) => ` ${text.padEnd(len)} `)
	const row3 = l + x.map(h => u.repeat(h.length)).join("┼") + l;
	return <>
		<Text>{l}{x.join(l)}{l}</Text>
		<Text>{row3}</Text>
	</>
}