import type { StarlightConfig } from '@astrojs/starlight/types'
import type { AstroConfig, AstroIntegrationLogger } from 'astro'
import { z } from 'astro/zod'
import * as fs from 'node:fs';

import type { StarlightVersionsConfig } from '..'
import type { DocsVersionsConfig } from '../schema'

import {
  copyDirectory,
  copyFile,
  ensureDirectory,
  getDirectoryStructure,
  listDirectory,
  readJSONFile,
  writeJSONFile,
} from './fs'
import { transformMarkdown } from './markdown'
import { ensureTrailingSlash, getExtension, stripExtension, stripLeadingSlash, stripTrailingSlash } from './path'
import { throwPluginError } from './plugin'
import {
  getDocSlug,
  type StarlightSidebarUserConfig,
  type StarlightUserConfig,
  addPrefixToSidebarConfig,
  type StarlightSidebar,
  getDocLocale,
} from './starlight'

const currentVersionSidebarGroupLabel = Symbol('StarlightVersionsCurrentVersionSidebarGroupLabel')

export const VersionBaseSchema = z.object({
  /**
   * The version redirect strategy used when navigating to this version:
   *
   * - `same-page`: Redirect to the same page when navigating to this version.
   * - `root`: Redirect to the root page of the documentation when to this version.
   *
   * @default 'same-page'
   */
  redirect: z.union([z.literal('root'), z.literal('same-page')]).default('same-page'),
})

export const VersionSchema = z
  .object({
    /**
     * An optional label used in the UI when displaying the version.
     * If not provided, the version slug is used.
     *
     * @example 'v2.0'
     * @example 'v3.1.2'
     */
    label: z.string().optional(),
    /**
     * The version slug used in URLs to identify the version and its content.
     *
     * @example '2.0'
     * @example '3-1-2'
     */
    slug: z.string().refine((value) => stripLeadingSlash(stripTrailingSlash(value))),
  })
  .merge(VersionBaseSchema)

export async function ensureNewVersion(
  config: StarlightVersionsConfig,
  starlightConfig: StarlightUserConfig,
  astroConfig: AstroConfig,
  logger: AstroIntegrationLogger,
) {
  const docsDir = new URL('content/docs/', astroConfig.srcDir)
  const newVersion = await checkForNewVersion(config, 'src/content/docs')

  if (!newVersion) return

  const { path, versionSlug } = ęxtractNewVersionPath(newVersion.slug)

  const subsetVersionDir = new URL(`${docsDir}${path}/`)

  const locales = Object.keys(starlightConfig.locales ?? {})

  const assets: VersionAsset[] = []
  logger.info(`${docsDir}versions/${newVersion.slug}`)

  await copyDirectory(
    subsetVersionDir,
    new URL(ensureTrailingSlash(`${docsDir}versions/${newVersion.slug}`)),
    async (entry) => {
      if (entry.type === 'directory') {
        if (!entry.isRoot) {
          const segments = entry.source.pathname.split('/')
          const lastSegment = segments.at(-2)
          const secondLastSegment = segments.at(-3)

          if (secondLastSegment && lastSegment === versionSlug && locales.includes(secondLastSegment)) {
            // Skip version directories in a locale directory.
            return true
          }

          // Do not skip other non-root directories.
          return false
        }

        // Skip root version directories.
        if (entry.name in config.versionsBySlug) return true

        const localeDir = locales.find((locale) => locale === entry.name)

        // Copy root directories not matching any locale.
        if (!localeDir) return false

        // Otherwise, swap the locale and version directories.
        return new URL(`../../${localeDir}/${versionSlug}/`, entry.dest)
      }

      const slug = getDocSlug(docsDir, entry.url)
      
      if(entry.url.toString().includes('.mdx') ) {
        const md = await transformMarkdown(entry.content, {
          assets: [],
          base: stripTrailingSlash(astroConfig.base),
          locale: getDocLocale(slug, starlightConfig),
          slug,
          url: entry.url,
          version: newVersion,
        })

    
        assets.push(...(md.assets ?? []))
  
        return md.content
      }
    },
  )

  for (const asset of assets) {
    await copyFile(asset.source, asset.dest)
  }

  await makeVersionConfig(newVersion, starlightConfig, astroConfig.srcDir)

  logger.info(`Created new version '${versionSlug}'.`)
}

export async function getVersionedSidebar(
  config: StarlightVersionsConfig,
  currentSidebar: StarlightSidebarUserConfig,
  srcDir: URL,
): Promise<NonNullable<StarlightSidebarUserConfig>> {
  const sidebar: StarlightSidebarUserConfig = [
    {
      label: currentVersionSidebarGroupLabel.toString(),
      items: currentSidebar ?? [],
    },
  ]
  
  for (const version of config.versions) {
    const versionSidebar = await getSidebarVersionGroup(version, srcDir)
    sidebar.push(versionSidebar)
  }
  
  return sidebar
}


export function getVersionSidebar(version: Version | undefined, sidebar: StarlightSidebar): StarlightSidebar {
  if(version?.slug === 'ts-sdk/1.0') {
    // console.log('VERSION ', version)
    // console.log('SIDEBAR ', JSON.stringify(sidebar, null, 2))
  }
  const sidebarVersionGroup = sidebar.find(
    (item) => item.label === (version?.slug ?? currentVersionSidebarGroupLabel.toString()),
  )
  
  // const jsonData = JSON.stringify(sidebarVersionGroup, null, 2);

  // // Define the file path
  // const filePath = 'output.txt';

  if (!sidebarVersionGroup || !('entries' in sidebarVersionGroup)) {
    throwPluginError(
      `Failed to find a sidebar group for the ${version ? `version '${version.slug}'` : 'current version'}.`,
    )
  }

  return [...sidebarVersionGroup.entries]
}

function removeVersion(url: string) {
  const urlSegments = url.split('/');

  const versionRegex = /^[-+]?[0-9]*\.?[0-9]+$/;
  const filteredSegments = urlSegments.filter(segment => !versionRegex.test(segment));

  return filteredSegments.join('/');
}

// An undefined version is valid and represents the current version.
// https://github.com/withastro/starlight/blob/64288fb0051310f7148afd13f65c578664f04eb2/packages/starlight/utils/localizedUrl.ts
export function getVersionURL(
  config: StarlightVersionsConfig,
  starlightConfig: StarlightConfig,
  url: URL,
  version: Version | undefined,
): URL {
  const versionURL = new URL(url)
  const versionFullRegex = /(?:ts-sdk|http-api)\/\d+(\.\d+)*$/

  const versionSlug = version?.slug ?? ''
  const versionRedirect = version?.redirect ?? config.current.redirect

  const base = stripTrailingSlash(import.meta.env.BASE_URL)
  const hasBase = versionURL.pathname.startsWith(base)

  if (hasBase) {
    versionURL.pathname = versionURL.pathname.replace(base, '')
  }

  let baseSegment: string | undefined
  let localeSegment: string | undefined

  const isHTML = getExtension(versionURL.pathname) === '.html'
  const [, firstSegment, secondSegment] = versionURL.pathname.split('/')

  if (starlightConfig.isMultilingual || starlightConfig.locales) {
    const versionOrLocale = firstSegment?.replace('.html', '')
    const isRootLocale = versionOrLocale && !Object.keys(starlightConfig.locales).includes(versionOrLocale)
    baseSegment = isRootLocale ? firstSegment : secondSegment

    if (!isRootLocale) {
      localeSegment = versionOrLocale
      versionURL.pathname = versionURL.pathname.replace(`/${firstSegment}`, '')
    }
  } else if(secondSegment && /^[-+]?[0-9]*\.?[0-9]+$/.test(secondSegment)) {
    baseSegment = `${firstSegment}/${secondSegment}`
  } else {
    baseSegment = firstSegment
  }

  const isRootHTML = baseSegment && getExtension(baseSegment) === '.html'
  const baseSlug = baseSegment && isRootHTML ? stripExtension(baseSegment) : baseSegment

  if (baseSlug && Object.keys(config.versionsBySlug).some((key) => key.includes(baseSlug))) {
    if (versionSlug) {
      versionURL.pathname =
        versionRedirect === 'same-page'
          ? versionURL.pathname.replace(baseSlug, versionSlug)
          : `${versionSlug}${isHTML ? '.html' : '/'}`
    } else if (isRootHTML) {
      versionURL.pathname = '/index.html'
    } else {
      
      versionURL.pathname =
        versionRedirect === 'same-page' ? removeVersion(versionURL.pathname) : isHTML ? '/index.html' : '/'
    }
  } else if (versionSlug) {
    versionURL.pathname =
      baseSegment === 'index.html'
        ? `/${versionSlug}.html`
        : versionRedirect === 'same-page'
          ? versionURL.pathname
          : isHTML
            ? `${versionSlug}.html`
            : `/${versionSlug}/`
  } else if (versionRedirect === 'root' && !isRootHTML) {
    versionURL.pathname = isHTML ? '/index.html' : versionSlug
  }

  if (localeSegment) {
    versionURL.pathname = isHTML
      ? versionURL.pathname === '/index.html'
        ? `/${localeSegment}.html`
        : `/${localeSegment}${versionURL.pathname.replace(/\/$/, '.html')}`
      : `/${localeSegment}${versionURL.pathname}`
  }

  if (hasBase) {
    versionURL.pathname = base + versionURL.pathname
  }

  if(version && !versionFullRegex.test(versionURL.pathname) && firstSegment && !versionURL.pathname.includes('ts-sdk') && !versionURL.pathname.includes('http-api')) {
    versionURL.pathname = `versionless:${version.slug}`
  }

  if((firstSegment === 'http-api' &&  version?.slug.includes('ts-sdk') )|| (firstSegment === 'ts-sdk' &&  version?.slug.includes('http-api'))) {
    versionURL.pathname = `incompatible:${version.slug}`  
  }


  return versionURL
}

// An undefined version is valid and represents the current version.
export function getVersionFromSlug(
  config: StarlightVersionsConfig,
  starlightConfig: StarlightConfig,
  slug: string,
): Version | undefined {
  const segments =  slug.split('/')
  
  const versionOrLocaleSegment = segments[0]
  
  if (!versionOrLocaleSegment) return undefined
  
  const fullVersionSegment = /^[-+]?[0-9]*\.?[0-9]+$/.test(versionOrLocaleSegment) ? versionOrLocaleSegment : `${segments[0]}/${segments[1]}`
  
  const version = config.versions.find((version) => version.slug === fullVersionSegment)
  
  if (version) return version
  
  const locales = Object.keys(starlightConfig.locales ?? {})
  
  if (!locales.includes(versionOrLocaleSegment)) return undefined
  
  const versionSegment = segments[1]
  
  return config.versions.find((version) => version.slug === versionSegment)
}

export function getActiveVersion(
  config: StarlightVersionsConfig,
  starlightConfig: StarlightConfig,
  slug: string,
): Version | undefined {
  const segments = slug.split('/')

  const versionOrLocaleSegment = segments[0]

  if (!versionOrLocaleSegment) return undefined

  const version = config.versions.find((version) => slug.includes(version.slug))

  if (version) return version

  const locales = Object.keys(starlightConfig.locales ?? {})

  if (!locales.includes(versionOrLocaleSegment)) return undefined

  return config.versions.find((version) => slug.includes(version.slug))
}

export function getVersionIdentifier(version: Version | undefined): string {
  return version?.slug ?? 'current'
}

// An undefined version is valid and represents the current version.
export function getVersionFromPaginationLink(
  config: StarlightVersionsConfig,
  link: string,
  locale: string | undefined,
): Version | undefined {
  const [, ...segments] = link.split('/')

  if (import.meta.env.BASE_URL !== '/') {
    // Remove the base segment if configured.
    segments.splice(0, 1)
  }

  if (locale) {
    // Remove the locale segment if the current locale is not a root locale.
    segments.splice(0, 1)
  }

  const versionSegment = segments[0]

  if (!versionSegment) return undefined

  return config.versions.find((version) => version.slug === versionSegment)
}

async function getSidebarVersionGroup(version: Version, srcDir: URL) {
  const versionConfig = await getVersionConfig(version, srcDir)
  
  // console.log('CURRENT SIDEBAR ', JSON.stringify(versionConfig, null, 2))
  if (!versionConfig.sidebar) {
    return {
      label: version.slug,
      autogenerate: { directory: version.slug },
    }
  }
  
  const test = {
    label: version.slug,
    items: addPrefixToSidebarConfig(version.slug, versionConfig.sidebar),
  }
  
  // console.log('TEST ', JSON.stringify(test, null, 2))
  return test
}

async function getVersionConfig(version: Version, srcDir: URL) {
  try {
    return await readJSONFile<DocsVersionsConfig>(getVersionConfigURL(version, srcDir))
  } catch (error) {
    throw new Error(`Failed to read the version '${version.slug}' configuration file.`, { cause: error })
  }
}

async function checkForNewVersion(config: StarlightVersionsConfig, docsDir: string): Promise<Version | undefined> {
  let newVersion: Version | undefined

  const docsDirectories = await getDirectoryStructure(docsDir)

  for (const version of config.versions) {
    // Check if any docsDirectory contains the substring version.slug
    const isVersionExisting = docsDirectories.some((directory) => directory.includes(version.slug))

    if (!isVersionExisting) {
      // Only consider as a new version if no directory contains the version.slug
      if (newVersion) {
        throw new Error('Only one new version can be configured at a time.')
      }
      newVersion = version
    }
  }

  return newVersion
}

function ęxtractNewVersionPath(newVersionPath: string) {
  const [pathBeforeLastSlash, pathAfterLastSlash] = [
    newVersionPath.slice(0, newVersionPath.lastIndexOf('/')),
    newVersionPath.slice(newVersionPath.lastIndexOf('/') + 1),
  ]

  return { path: pathBeforeLastSlash, versionSlug: pathAfterLastSlash }
}

async function makeVersionConfig(version: Version, starlightConfig: StarlightUserConfig, srcDir: URL) {
  const docsDir = new URL('content/docs/', srcDir)

  const [versionName, versionNumber] = version.slug.split('/')
  const { path } = ęxtractNewVersionPath(version.slug)

  await ensureDirectory(getVersionContentCollectionURL(srcDir, path))

  const sidebar = starlightConfig.sidebar

  const entries = await listDirectory(new URL(ensureTrailingSlash(`${docsDir}versions`)))
  // const dirNamesToRemove = new Set(entries.filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name).filter((direntName)=> !version.slug.includes(direntName)))

  const updatedSidebar = sidebar
    ?.filter(
      (sidebarItem) => {
        if(typeof sidebarItem === 'string' || !versionName) return false;
        if('autogenerate' in sidebarItem) {
          if(sidebarItem.autogenerate.directory.includes(versionName)) return true
          return false
        } 
        if('slug' in sidebarItem) {
          if(sidebarItem.slug.includes(versionName)) return true
          return false
        }
        if('items' in sidebarItem) {
          if(sidebarItem.items.filter((item)=>typeof item !=='string').some((item)=> (('autogenerate' in item && item.autogenerate.directory.includes(versionName) ) || ('slug' in item  && item.slug.includes(versionName))))) return true
          return false
        }
        return false
      }
    )
    .map((item) => {
      if (
        item.autogenerate &&
        item.autogenerate.directory === path) {
        const updatedItem = {
          ...item,
          autogenerate: {
            ...item.autogenerate,
            directory: `versions/${version.slug}`,
          },
        }
        return updatedItem
      }
      return item
    })

  await writeJSONFile(getVersionConfigURL(version, srcDir), {
    sidebar: updatedSidebar,
  } satisfies DocsVersionsConfig)
}

function getVersionContentCollectionURL(srcDir: URL, versionPath: string) {
  return new URL(`content/versions/${versionPath}`, srcDir)
}

function getVersionConfigURL(version: Version, srcDir: URL) {
  const { versionSlug } = ęxtractNewVersionPath(version.slug)

  return new URL(`${versionSlug}.json`, getVersionContentCollectionURL(srcDir, version.slug))
}

export type Version = z.output<typeof VersionSchema>

export interface VersionAsset {
  source: URL
  dest: URL
}
