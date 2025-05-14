import { defineRouteMiddleware, type StarlightRouteData } from '@astrojs/starlight/route-data'
import starlightConfig from 'virtual:starlight/user-config'
import starlightVersionsConfig from 'virtual:starlight-versions-config'

import { getVersionFromPaginationLink, getVersionFromSlug, getVersionSidebar, type Version } from './libs/versions'

const versionRegex = /(?:ts-sdk|http-api)\/\d+(\.\d+)*$/;
const versionedSectionRegex = /(?:ts-sdk|http-api)\//;

function containsHref(entries: any[], regex: RegExp): boolean {
    return entries.some(entry => {
        if (entry.type === 'link' && entry.href && regex.test(entry.href)) {
            return true;
        }
        if (entry.type === 'group' && entry.entries) {
            return containsHref(entry.entries, regex); // Recursive search in the case of nested groups
        }
        return false;
    });
}

function filterGroups(groups: any[], regex: RegExp): any[] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    return groups.filter(group => !containsHref(group.entries, regex));
}

export const onRequest = defineRouteMiddleware(async (context, next) => {

  const { starlightRoute } = context.locals
  const { entry, locale, pagination, sidebar } = starlightRoute

  const selectedVersion = context.cookies.get('selectedVersion')

  const commonSidebarEntries = filterGroups(getVersionSidebar(
    getVersionFromSlug(starlightVersionsConfig, starlightConfig, ''),
    sidebar,
  ), versionRegex)

  const baseSidebarEntries = filterGroups(commonSidebarEntries, versionedSectionRegex)

  const versionSidebarEntries = selectedVersion?.value ? getVersionSidebar(
    getVersionFromSlug(starlightVersionsConfig, starlightConfig, selectedVersion.value),
    sidebar,
  ) : []
  
  // console.log('versionSidebarEntries ',JSON.stringify(versionSidebarEntries, null, 2))

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  starlightRoute.sidebar =  selectedVersion?.value && getVersionFromSlug(starlightVersionsConfig, starlightConfig, selectedVersion.value) ? [...baseSidebarEntries, ...versionSidebarEntries] : commonSidebarEntries
  
  const pageVersion = getVersionFromSlug(starlightVersionsConfig, starlightConfig, entry.slug)

  starlightRoute.pagination.prev = getPaginationLink(locale, pageVersion, pagination.prev)
  starlightRoute.pagination.next = getPaginationLink(locale, pageVersion, pagination.next)

  return next()
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
