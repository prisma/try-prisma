import { describe, expect, it, vi } from "vitest";
import main from '../src/index'
import InputCollector from '../src/cli/input-collector'
import CLI from '../src/cli/index'
import logger from '../src/utils/logger'
import download from '../src/helpers/download'
import installPackages from '../src/helpers/installPackages'

vi.mock('../src/cli/input-collector', () => {
  return {
    default: class {
      answers = {
        template: 'template',
        install: true,
        name: 'name',
        dirpath: 'dirpath',
        pkgMgr: 'pkgMgr',
      }
      collect = vi.fn(() => this.answers)
    }
  }
})

vi.mock('../src/cli/index', () => ({
  default: vi.fn(() => ({
    template: 'template',
    install: true,
    name: 'name',
    dirpath: 'dirpath',
    pkgMgr: 'pkgMgr'
  }))
}))
vi.mock('../src/utils/logger', () => ({ default: { error: vi.fn((e) => console.log(e)), success: vi.fn((e) => console.log(e)) } }))
vi.mock('../src/helpers/download', () => ({ default: vi.fn() }))
vi.mock('../src/helpers/installPackages', () => ({ default: vi.fn() }))

// Need to write these tests
describe("CLI Interface", () => {
  it("foo", async () => {
    await main()
    expect(process.exit).toHaveBeenCalledWith(1)
  });
});
