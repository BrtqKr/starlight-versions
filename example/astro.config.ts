import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'
import starlightVersions from 'starlight-versions'

export default defineConfig({
  integrations: [
    starlight({
      plugins: [
        starlightVersions({
          versions: [
            {
              slug: 'ts-sdk/1.0',
              label: 'ts-sdk v1.0',
            },
            {
              slug: 'http-api/1.0',
              label: 'http-api v1.0',
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
        {
          label: 'HTTP API',
          autogenerate: { directory: 'http-api' },
        },
        {
          label: 'TS SDK',
          autogenerate: { directory: 'ts-sdk' },
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
})
