import { defineAction } from 'astro:actions'
import { z } from 'astro:schema'
import { navigate } from 'astro:transitions/client'
import StarlightVersionsConfig from 'virtual:starlight-versions-config'

export const server = {
  updateSelectedVersion: defineAction({
    accept: 'form',
    input: z.object({ version: z.string() }),
    handler: async ({version}) => {
      try {

        // const selectedValue = version
        //   .split('/')
        //   .filter((part) => part !== '')
        //   .slice(0, 2)
        //   .join('/')

        // const optionSlugs = StarlightVersionsConfig.versions.map((v) => v.slug)
        // return 'test'
        return 'success'
      } catch (error) {
        console.error('Failed to update selected version:', error)
        return 'error' // Indicate a server error in a way you can handle client-side
      }
    },
  }),
}
