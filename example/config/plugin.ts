import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  // static: true,
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks',
  },
 	eggpig: {
 		enable: true,
 		package: 'egg-pig'
 	}
};

export default plugin;
