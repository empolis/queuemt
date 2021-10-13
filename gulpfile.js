const { exec } = require('child_process')
const { join, basename } = require('path')
const fs = require('fs-extra')

const BUILD_PATH = join(__dirname, 'build')

function cleanWorkingDirectory () {
  fs.emptyDirSync(BUILD_PATH)
}

async function buildBinaries () {
  await runCommand('npm run package')
  const dirs = fs
    .readdirSync(BUILD_PATH)
    .filter(f => fs.statSync(join(BUILD_PATH, f)).isDirectory())

  for (const dir of dirs) {
    await zipDirectory(join(BUILD_PATH, dir))
  }
}

async function runTests () {
  await runCommand('npm run test')
}

async function buildAll () {
  cleanWorkingDirectory()
  await runTests()
  await buildBinaries()
}

async function runCommand (command, cwd = join(__dirname)) {
  return new Promise((resolve, reject) => {
    const process = exec(command, {
      cwd: cwd
    })

    process.stdout.on('data', data => {
      console.log(data)
    })

    process.stderr.on('data', data => {
      console.log(data)
    })

    process.on('close', code => {
      if (code !== 0) {
        reject()
      } else {
        resolve()
      }
    })
  })
}

async function zipDirectory (directory) {
  await runCommand(
    `zip -r ${basename(directory).replace('-unpacked', '')}.zip *`,
    directory
  )
  fs.renameSync(
    `${join(directory, `${basename(directory).replace('-unpacked', '')}.zip`)}`,
    join('build', `${basename(directory).replace('-unpacked', '')}.zip`)
  )
}

exports.default = buildAll
