import fs from 'fs'

export const makeDir = async (
  path: string,
  options = { recursive: true }
): Promise<string | undefined> => {
  return fs.promises.mkdir(path, options)
}
