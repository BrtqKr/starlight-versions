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
          label: "Fundamentals",
          items: [
            { label: "Getting started", slug: "fundamentals/getting-started" },
            { label: "Glossary of terms", slug: "fundamentals/glossary" },
            {
              label: "Concepts",
              autogenerate: { directory: "fundamentals/concepts" },
            },
          ],
        },
        {
          label: "Deployment",
          items: [
            { label: "Setup", slug: "deployment/setup" },
            { label: "Configuration", slug: "deployment/configuration" },
            {
              label: "Variants",
              autogenerate: { directory: "deployment/variants" },
            },
          ],
        },
        {
          label: "TypeScript SDK",
          items: [
            { label: "Overview", slug: "ts-sdk/overview" },
            { label: "Project configuration", slug: "ts-sdk/configuration" },
            { label: "Smelter", slug: "ts-sdk/smelter" },
            { label: "OfflineSmelter", slug: "ts-sdk/smelter-offline" },
            {
              label: "Smelter Managers",
              collapsed: true,
              autogenerate: { directory: "ts-sdk/managers" },
            },
            {
              label: "Components",
              collapsed: true,
              autogenerate: { directory: "ts-sdk/components" },
            },
            {
              label: "Props",
              collapsed: true,
              autogenerate: { directory: "ts-sdk/props" },
            },
            {
              label: "Hooks",
              collapsed: true,
              autogenerate: { directory: "ts-sdk/hooks" },
            },
            {
              label: "Inputs",
              collapsed: true,
              autogenerate: { directory: "ts-sdk/inputs" },
            },
            {
              label: "Outputs",
              collapsed: true,
              autogenerate: { directory: "ts-sdk/outputs" },
            },
            {
              label: "Resources",
              collapsed: true,
              autogenerate: { directory: "ts-sdk/resources" },
            },
            {
              label: "Guides",
              collapsed: true,
              autogenerate: { directory: "ts-sdk/guides" },
            },
          ],
        },
        {
          label: "HTTP API",
          items: [
            { label: "Overview", slug: "http-api/overview" },
            { label: "Routes", slug: "http-api/routes" },
            {
              label: "Events",
              slug: "http-api/events",
            },
            {
              label: "Components",
              collapsed: true,
              autogenerate: { directory: "http-api/components" },
            },
            {
              label: "Inputs",
              collapsed: true,
              autogenerate: { directory: "http-api/inputs" },
            },
            {
              label: "Outputs",
              collapsed: true,
              autogenerate: { directory: "http-api/outputs" },
            },
            {
              label: "Resources",
              collapsed: true,
              autogenerate: { directory: "http-api/resources" },
            },
            {
              label: "Guides",
              collapsed: true,
              autogenerate: { directory: "http-api/guides" },
            },
          ],
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