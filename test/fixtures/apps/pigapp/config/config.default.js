"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (appInfo) => {
    const config = {};
    // app special config
    config.sourceUrl = `https://github.com/eggjs/examples/tree/master/${appInfo.name}`;
    // override config from framework / plugin
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1523969653835_3209';
    // add your config here
    config.middleware = [];
    config.security = {
        csrf: false
    };
   	config.view = {
        defaultViewEngine: 'nunjucks',
        mapping: {
            '.tpl': 'nunjucks',
        },
    };
    return config;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmRlZmF1bHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb25maWcuZGVmYXVsdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVVBLGtCQUFlLENBQUMsT0FBcUIsRUFBRSxFQUFFO0lBQ3ZDLE1BQU0sTUFBTSxHQUFHLEVBQTRDLENBQUM7SUFFNUQscUJBQXFCO0lBQ3JCLE1BQU0sQ0FBQyxTQUFTLEdBQUcsaURBQWlELE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUVuRiwwQ0FBMEM7SUFDMUMsdUVBQXVFO0lBQ3ZFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxxQkFBcUIsQ0FBQztJQUVuRCx1QkFBdUI7SUFDdkIsTUFBTSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7SUFHdkIsTUFBTSxDQUFDLE1BQU0sR0FBRztRQUNkLEdBQUcsRUFBRSxJQUFJO1FBQ1QsS0FBSyxFQUFFLElBQUk7S0FDWixDQUFBO0lBR0QsTUFBTSxDQUFDLFFBQVEsR0FBRztRQUNoQixJQUFJLEVBQUUsS0FBSztLQUNaLENBQUE7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDLENBQUMifQ==