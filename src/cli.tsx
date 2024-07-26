import './init.js';

import React from 'react';
import { render } from 'ink';
import { getFontJSON } from './utils/app.utils.js';
import { isType, wait } from './utils/general.utils.js';
import { App } from './views/apps.js';


wait(0).then(async () => {

    // const fontDir = joinAppDir(env.isDev ? '../temp' : '~/.termux/fonts');
    // const fileDir = join(fontDir, 'test.png')
    // const x = download('https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_272x92dp.png', fileDir, (n) => log(n + '%'))


    const isOnline = true;
    const fontDir = joinAppDir(env.isDev ? '../temp' : '~/.termux/fonts');

    const fontData = await getFontJSON(fontDir, !isOnline);
    if (isType(fontData, 'string')) return logErr(fontData);

    render(<App fonts={fontData} fontDir={fontDir} />)
});
