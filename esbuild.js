#!/usr/bin/env node
const esbuild = require('esbuild');

esbuild
    .build({
        entryPoints: ['src/index.ts'],
        outdir: 'lib',
        bundle: true,
        sourcemap: true,
        minify: true,
        platform: 'node',
        target: ['node16'],
        logLevel: "info",
        watch: process.argv.includes('--watch')
    })
    .catch((err) => {
      console.log(err);
      process.exit(1)
    });


