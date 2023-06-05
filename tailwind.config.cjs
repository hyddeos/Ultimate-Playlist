const config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    colors: {
      /* dark 900 darkest and 700 lighter */
      'dark': {
        '50': '#f7f7f7',
        '100': '#e3e3e3',
        '200': '#c8c8c8',
        '300': '#a4a4a4',
        '400': '#818181',
        '500': '#666666',
        '600': '#515151',
        '700': '#434343',
        '800': '#383838',
        '900': '#1c1c1c',
    },
    /* Light Text 50 Headings, 200 paragraphs */
    'light': {
        '50': '#ffffff',
        '100': '#efefef',
        '200': '#dcdcdc',
        '300': '#bdbdbd',
        '400': '#989898',
        '500': '#7c7c7c',
        '600': '#656565',
        '700': '#525252',
        '800': '#464646',
        '900': '#3d3d3d',
    },
    /* Prim, yellow, 400 as std */
    'prim': {
        '50': '#fff8eb',
        '100': '#fdebc8',
        '200': '#fbd78c',
        '300': '#f9bc50',
        '400': '#f7a62f',
        '500': '#f08110',
        '600': '#d55d0a',
        '700': '#b13e0c',
        '800': '#8f3111',
        '900': '#762911',
    },
    /* Sec, blue 500 */
    'sec': {
        '50': '#f1fcfb',
        '100': '#cef9f4',
        '200': '#9ef1ea',
        '300': '#65e3dc',
        '400': '#35ccc9',
        '500': '#1cb0af',
        '600': '#148b8d',
        '700': '#146e71',
        '800': '#15575a',
        '900': '#16494b',
    },
    /* Extras */    
      'stroke': '#121629', 
      'error':  '#EC6A52',
      'succes': '#70C09E',
    },
    fontFamily: {
      'heading': ['"Changa One"'],
      'handwrite': ['"Permanent Marker"'],
      'ingress': ['Lora'],
      'paragraph': ['"Hind Madurai"'],
    },
    extend: {},
  },

  plugins: [],
};

module.exports = config;
