import path from "node:path"
import fs from "node:fs/promises"

const readFoldersRecursively = async (folderPath: string, foldersToIgnore: Array<string> = []): Promise<Array<string>> => {
  const folders: Array<string> = []

  const direntList = await fs.readdir(folderPath, { withFileTypes: true })
  const filteredFolders = direntList.filter(
    dirent => {
      const isDirectory = dirent.isDirectory()
      const doesNameEndsWithDot = dirent.name.endsWith(".")
      const isIgnoredFolder = foldersToIgnore.includes(dirent.name)

      return isDirectory && !doesNameEndsWithDot && !isIgnoredFolder
    }
  )

  for (const folder of filteredFolders) {
    const currentFolderPath = path.join(folderPath, folder.name)
    const subFolders = await readFoldersRecursively(currentFolderPath)
    folders.push(folder.name, ...subFolders.map(subFolder => path.join(folder.name, subFolder)))
  }

  return folders
}

const main = async () => {
  const folderPath = process.argv[2]
  if (!folderPath)
    throw new Error("No folder path provided")

  const foldersToIgnore = JSON.parse(process.argv[3] || "[]")

  const folders = await readFoldersRecursively(folderPath, foldersToIgnore)

  console.log(JSON.stringify(folders, null, 2))
}

main()
