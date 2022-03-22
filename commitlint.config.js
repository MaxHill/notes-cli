module.exports = {
  extends: ['@commitlint/config-conventional'],
  ignores: [(message) => /^chore\(release\):\ \[.+]\(.+\) from .+ to .+\.$/m.test(message)],
}

