import {build} from 'esbuild';
import fs from 'node:fs';
await build({entryPoints:['src/main.tsx'],bundle:true,minify:true,format:'iife',outfile:'dist/app.js',loader:{'.wav':'dataurl','.png':'dataurl'},jsx:'automatic',define:{HELP_API_URL:JSON.stringify(process.env.HELP_API_URL||'')},legalComments:'eof'});
const css=fs.readFileSync('dist/app.css','utf8');
const js=fs.readFileSync('dist/app.js','utf8').replace(/<\/script/gi,'<\\/script');
const html=fs.readFileSync('index.html','utf8');
const head=html.slice(0,html.indexOf('<style>'));
const body=html.slice(html.indexOf('</style>')+8,html.indexOf('<script>'));
fs.writeFileSync('dist/index.html',head+'<style>'+css+'</style>'+body+'<script>'+js+'</script></html>');
