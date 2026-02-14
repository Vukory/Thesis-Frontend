import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { Transform } from 'node:stream';
import { promisify, styleText } from 'node:util';
import pluginWebc from '@11ty/eleventy-plugin-webc';
import cssnano from 'cssnano';
import postcss from 'postcss';
import postcssPresetEnv from 'postcss-preset-env';
import { optimize } from 'svgo';
import config from './src/_data/config.js';

const postcssProcessor = postcss([
  postcssPresetEnv,
  cssnano({ preset: 'default' }),
]);

/**
 * @type {import('svgo').Config}
 */
const svgoConfig = {
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          mergePaths: {
            noSpaceAfterFlags: true
          }
        },
      },
    },
    {
      name: 'removeXlink',
      params: {
        includeLegacy: true
      }
    },
  ]
};

let pyftsubsetWarning = false;

export default function (eleventyConfig) {
  eleventyConfig.setOutputDirectory('./_site/');
  eleventyConfig.setInputDirectory('./src/');
  eleventyConfig.addPassthroughCopy('./src/CNAME');
  eleventyConfig.addPassthroughCopy('./src/lib/');
  eleventyConfig.addPassthroughCopy('./src/robots.txt');
  eleventyConfig.addWatchTarget('./src/**/*.css');

  eleventyConfig.addPassthroughCopy('./src/assets/', {
    /**
     * 
     * @param {string} src 
     * @param {string} _dest 
     * @param {import('fs').Stats} _stats 
     * @returns 
     */
    transform: (src, _dest, _stats) => {
      if (path.extname(src) !== '.svg') {
        return;
      }

      return new Transform({
        transform(chunk, enc, callback) {
          callback(null, optimize(chunk.toString(), svgoConfig).data);
        }
      });
    }
  });

  eleventyConfig.on('eleventy.after', async ({ directories }) => {
    const { input, output } = directories;

    const results = await fs.readdir(path.join(input, 'fonts'), {
      withFileTypes: true,
    });
    const fonts = results.filter(r => r.name.endsWith('.woff2'));

    if (fonts.length === 0) {
      return;
    }

    await fs.mkdir(path.join(output, 'fonts'), { recursive: true });

    for (const font of fonts) {
      const src = path.join(font.parentPath, font.name);
      const dest = path.join(output, 'fonts', font.name);
      const unicodes = src.replace('.woff2', '.unicodes.txt');

      try {
        await promisify(execFile)('pyftsubset', [
          src,
          '--flavor=woff2',
          `--unicodes-file=${unicodes}`,
          `--output-file=${dest}`,
          '--drop-tables+=FFTM',
        ]);
      } catch (/** @type {any} */ error) {
        switch (error.code) {
          case 'ENOENT':
            if (config.env === 'production') {
              console.error('%s pyftsubset not installed, required for production builds', styleText('red', '×'));
              process.exit(1);
            }

            if (!pyftsubsetWarning) {
              console.warn('%s pyftsubset not installed, skipping font optimizations', styleText('red', '×'));
              pyftsubsetWarning = true;
            }

            await fs.copyFile(
              path.join(font.parentPath, font.name),
              path.join(output, 'fonts', font.name)
            );
            break;
          default:
            throw error;
        }
      }
    }
  });

  eleventyConfig.addPlugin(pluginWebc, {
    components: 'src/_components/**/*.webc',
    bundlePluginOptions: {
      transforms: [
        async function (content) {
          // @ts-expect-error
          if (this.type === 'css') {
            const result = await postcssProcessor.process(
              content,
              { from: undefined }
            );
            return result.css;
          }

          return content;
        },
      ],
    },
  });
};
