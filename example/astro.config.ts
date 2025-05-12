import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightVersions from 'starlight-versions'
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  integrations: [
    starlight({
      prerender: false,
      plugins: [
        starlightVersions({
          versions: [
            {
              slug: 'ts-sdk/1.0',
              label: 'ts-sdk v1.0',
            },
          ],
        }),
      ],
      customCss: ['./src/styles/custom.css'],
      editLink: {
        baseUrl: 'https://github.com/HiDeoo/starlight-versions/edit/main/example/',
      },
      sidebar: [
        {
          label: 'Start Here',
          items: [{ slug: 'getting-started' }, { label: 'Another Page', link: '/another-page/' }],
        },
        {
          label: 'Guides',
          autogenerate: { directory: 'guides' },
        },
        // {
        //   label: 'HTTP API',
        //   autogenerate: { directory: 'http-api' },
        // },
        {
          label: "TypeScript SDK",
          items: [
            { label: "One", slug: "ts-sdk/one" },
            { label: "Two", slug: "ts-sdk/two" },
          ]
        },
      ],
      social: {
        blueSky: 'https://bsky.app/profile/hideoo.dev',
        github: 'https://github.com/HiDeoo/starlight-versions',
      },
      title: 'Starlight Versions Example',
    }),
  ],
  site: 'https://starlight-versions-example.vercel.app',
  adapter: node({
    mode: 'standalone',
  }),
})