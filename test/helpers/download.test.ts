import { describe, it, expect, vi, beforeEach, afterEach, beforeAll } from 'vitest'
import download from '../../src/helpers/download'
import * as fetch from 'node-fetch'


describe('Download', () => {
  beforeEach(() => {
    vi.mock('node-fetch', () => ({default: vi.fn()}))
  })
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('Should fail when no template is sent', async () => {
    await expect( async () => 
      await download({
        template: '',
        dirpath: 'dirpath',
        install: true,
        name: 'name',
        pkgMgr: 'pnpm'
      })
    ).rejects.toThrow()
  })

  it('Should fail when the fetch for the repo tar fails', async () => {
    vi.spyOn(fetch as any, 'default').mockResolvedValue({ status: 404})
    await expect( async () => 
      await download({
        template: 'template',
        dirpath: 'dirpath',
        install: true,
        name: 'name',
        pkgMgr: 'pnpm'
      })
    ).rejects.toThrow()
  })

  it('Should run the pipeline', async () => {
    vi.mock('util', () => ({ promisify: () => {
      return () => null
    }}))

    vi.spyOn(fetch as any, 'default').mockResolvedValue({ status: 200})
    expect(async () => {
      await download({
        template: 'template',
        dirpath: 'dirpath',
        install: true,
        name: 'name',
        pkgMgr: 'pnpm'
      })
    }).not.toThrow()
  })
})