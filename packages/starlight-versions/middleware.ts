import { defineRouteMiddleware, type StarlightRouteData } from '@astrojs/starlight/route-data'
import starlightConfig from 'virtual:starlight/user-config'
import starlightVersionsConfig from 'virtual:starlight-versions-config'

import { getVersionFromPaginationLink, getVersionFromSlug, getVersionSidebar, type Version } from './libs/versions'

const versionRegex = /(?:ts-sdk|http-api)\/\d+(\.\d+)*$/;

function containsVersionHref(entries: any[]): boolean {
    return entries.some(entry => {
        if (entry.type === 'link' && entry.href && versionRegex.test(entry.href)) {
            return true;
        }
        if (entry.type === 'group' && entry.entries) {
            return containsVersionHref(entry.entries); // Recursive search in the case of nested groups
        }
        return false;
    });
}

function filterGroups(groups: any[]): any[] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return groups.filter(group => !containsVersionHref(group.entries));
}

export const onRequest = defineRouteMiddleware((context) => {
  const { starlightRoute } = context.locals
  const { entry, locale, pagination, sidebar } = starlightRoute

  
  const commonSidebarEntries = filterGroups(getVersionSidebar(
    getVersionFromSlug(starlightVersionsConfig, starlightConfig, ''),
    sidebar,
    starlightVersionsConfig
  ))

  const versionSidebarEntries = getVersionSidebar(
    getVersionFromSlug(starlightVersionsConfig, starlightConfig, entry.slug),
    sidebar,
    starlightVersionsConfig
  )
  

  
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  starlightRoute.sidebar = commonSidebarEntries
  

  console.log('TEST ', JSON.stringify(versionSidebarEntries, null, 2))
  const versions = Object.keys(starlightVersionsConfig.versionsBySlug)

  const pageVersion = getVersionFromSlug(starlightVersionsConfig, starlightConfig, entry.slug)

  starlightRoute.pagination.prev = getPaginationLink(locale, pageVersion, pagination.prev)
  starlightRoute.pagination.next = getPaginationLink(locale, pageVersion, pagination.next)
})

function getPaginationLink(locale: string | undefined, currentVersion: Version | undefined, link: PaginationLink) {
  if (!link) return undefined

  const linkVersion = getVersionFromPaginationLink(starlightVersionsConfig, link.href, locale)

  // If the current version is not the same as the link version, remove the link.
  return (currentVersion === undefined && linkVersion === undefined) || currentVersion?.slug === linkVersion?.slug
    ? link
    : undefined
}

type PaginationLink = StarlightRouteData['pagination']['next']
