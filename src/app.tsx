import React, { useEffect, useState } from 'react';
import {Text, useInput, useStdout} from 'ink';
import { isType } from './utils/general.utils.js';

const u = '─';
const l = '│';
// const nl = '\n';

export function Table({
	title, headers: _headers, data
}: {
	title?: str;
	headers: str[];
	data: (str | num | bol)[][];
}) {
	const [selIdx, setSelIdx] = useState(0);

	useInput((input, key) => {
		if (key.upArrow || input === 'j')
			setSelIdx(Math.max(selIdx - 1, 0))
		if (key.downArrow || input === 'k')
			setSelIdx(Math.min(selIdx + 1, data.length - 1))
	}, { isActive: true });

    const { stdout } = useStdout();
    const [viewportHeight, setViewportHeight] = useState(stdout.rows - 6); // Adjust for header and footer

    useEffect(() => {
        const updateViewportHeight = () => {
            setViewportHeight(stdout.rows - 6);
        };
        stdout.on('resize', updateViewportHeight);
        return () => {
            stdout.off('resize', updateViewportHeight);
        };
    }, [stdout]);

	const strData = data.map(arr => arr.map(x => !isType(x, 'string') ? x.toString() : x));
	const cLen = _headers.map(s => s.length);
    strData.map(arr => arr.map((s, i) => cLen[i] = Math.max(cLen[i] || 0, s.length)))
	const tableWidth = cLen.reduce((sum, a) => sum + a + 2, cLen.length + 1) - 2;

	const line = u.repeat(tableWidth);

    const top = title ? <Title {...{title, tableWidth }} /> : <Text>{`┌${line}┐`}</Text>
	const headers = _headers.map((text, i) => [text, cLen[i] || 0] as [str, num])
    const bot = `└${line}┘`;

	const dataSliceIdx = selIdx//selIdx > strData.length - viewportHeight ? strData.length - viewportHeight : selIdx;

	return <>
		{top}
		<TableHeader {...{headers}}/>
		{strData.slice(dataSliceIdx, selIdx + viewportHeight).map((arr) => {
			const idx = Number(arr[0]) - 1;
			const rowContent = arr.map((s, i) => ` ${s.padEnd(cLen[i]!)} `).join(l);
			return <Text key={idx}>
				{l}<Text
					backgroundColor={idx % 2 ? 'black' : 'gray'}
					inverse={idx === selIdx}
				>{rowContent}</Text>{l}
			</Text>;
    	})}
		{<Text>{'...' || bot}</Text>}
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