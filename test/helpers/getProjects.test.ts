import { describe, vi, expect, it, beforeEach, afterEach } from 'vitest'
import * as fetch from 'node-fetch'
import getProjects from '../../src/helpers/getProjects'

describe('Get Projects', () => {
  beforeEach(() => {
    vi.mock('node-fetch', () => ({default: vi.fn()}))
  })
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('Should throw an error if the GET request fails for project data', () => {
    vi.spyOn(fetch as any, 'default').mockResolvedValue({ status: 404, json: () => null })
    expect(async () => await getProjects()).rejects.toThrow()
  })

  it('Should ignore directories that start with "."', async () => {
    vi.spyOn(fetch as any, 'default').mockResolvedValue({ 
      status: 200,
      json: () => ({
        tree: [{
          path: '.github/package.json',
          type: 'blob'
        }]
      })
    })
    const data = await getProjects()

    expect(data).toStrictEqual([])
  })
  it('Should ignore directories that do not have a package.json', async () => {
    vi.spyOn(fetch as any, 'default').mockResolvedValue({ 
      status: 200,
      json: () => ({
        tree: [{
          path: 'test/README.md',
          type: 'blob'
        },{
          path: 'test/index.ts',
          type: 'blob'
        }]
      })
    })
    const data = await getProjects()

    expect(data).toStrictEqual([])
  })
  it('Should return an array with a file path to a valid project', async () => {
    vi.spyOn(fetch as any, 'default').mockResolvedValue({ 
      status: 200,
      json: () => ({
        tree: [{
          path: 'test/README.md',
          type: 'blob'
        },{
          path: 'test/package.json',
          type: 'blob'
        }]
      })
    })
    const data = await getProjects()

    expect(data.length).toBe(1)
    expect(data).toContain('test')
  })

  it('Should work as expected with a "tree" type', async () => {
    vi.spyOn(fetch as any, 'default').mockResolvedValue({ 
      status: 200,
      json: () => ({
        tree: [{
          path: 'test',
          type: 'tree'
        },{
          path: 'test/package.json',
          type: 'blob'
        }]
      })
    })
    const data = await getProjects()

    expect(data.length).toBe(1)
    expect(data).toContain('test')
  })

  it('Should return multiple valid projects', async () => {
    vi.spyOn(fetch as any, 'default').mockResolvedValue({ 
      status: 200,
      json: () => ({
        tree: [{
          path: 'test',
          type: 'tree'
        },{
          path: 'test/package.json',
          type: 'blob'
        },{
          path: 'test2',
          type: 'tree'
        },{
          path: 'test2/package.json',
          type: 'blob'
        }]
      })
    })
    const data = await getProjects()

    expect(data.length).toBe(2)
    expect(data).toContain('test')
    expect(data).toContain('test2')
  })

  it('Should return valid projects and filter bad projects', async () => {
    vi.spyOn(fetch as any, 'default').mockResolvedValue({ 
      status: 200,
      json: () => ({
        tree: [{
          path: 'test',
          type: 'tree'
        },{
          path: 'test/readme.md',
          type: 'blob'
        },{
          path: 'test2',
          type: 'tree'
        },{
          path: 'test2/package.json',
          type: 'blob'
        }]
      })
    })
    const data = await getProjects()

    expect(data.length).toBe(1)
    expect(data).toContain('test2')
  })
})